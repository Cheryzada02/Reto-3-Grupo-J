import { insert_into_products, upload_image } from "../authentication/db_functions";

const CSV_ALIASES = {
  product_name: ["product_name", "name", "nombre"],
  description: ["description", "descripcion"],
  supplier_id: ["supplier_id", "suplidor_id"],
  cost_price: ["cost_price", "cost", "costo"],
  sale_price: ["sale_price", "price", "precio_venta"],
  current_stock: ["current_stock", "stock", "inventario"],
  min_stock: ["min_stock", "stock_minimo", "inventario_minimo"],
  status: ["status", "estado"],
  image_url: ["image_url", "ruta_imagen"],
  department_id: ["department_id"],
};

const normalizeKey = (value) =>
  String(value || "")
    .trim()
    .replace(/^\uFEFF/, "")
    .toLowerCase();

const normalizePath = (value) =>
  String(value || "")
    .trim()
    .replaceAll("\\", "/")
    .toLowerCase();

const fileNameFromPath = (value) => {
  const cleanPath = normalizePath(value);
  return cleanPath.split("/").pop();
};

const toNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") return fallback;

  const numberValue = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const getField = (row, aliases) => {
  for (const alias of aliases) {
    const value = row[alias];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
};

export async function readCsvText(csvFile, encoding = "auto") {
  const buffer = await csvFile.arrayBuffer();

  if (encoding !== "auto") {
    return new TextDecoder(encoding).decode(buffer);
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1252").decode(buffer);
  }
}

function parseCsvRows(csvText) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const delimiter = detectDelimiter(csvText);

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"') {
      if (quoted && nextChar === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === delimiter && !quoted) {
      row.push(field.trim());
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(field.trim());
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field || row.length) {
    row.push(field.trim());
    rows.push(row);
  }

  return rows.filter((item) => item.some((cell) => cell !== ""));
}

function detectDelimiter(csvText) {
  const firstLine = String(csvText || "").split(/\r?\n/)[0] || "";
  const commas = (firstLine.match(/,/g) || []).length;
  const semicolons = (firstLine.match(/;/g) || []).length;

  return semicolons > commas ? ";" : ",";
}

export function parseProductsCsv(csvText) {
  const rows = parseCsvRows(String(csvText || ""));
  const [headerRow, ...dataRows] = rows;

  if (!headerRow) return [];

  const headers = headerRow.map(normalizeKey);

  return dataRows.map((cells, index) => {
    const row = {};

    headers.forEach((header, cellIndex) => {
      row[header] = cells[cellIndex] ?? "";
    });

    return {
      rowNumber: index + 2,
      product_name: getField(row, CSV_ALIASES.product_name),
      description: getField(row, CSV_ALIASES.description),
      supplier_id: toNumber(getField(row, CSV_ALIASES.supplier_id)),
      cost_price: toNumber(getField(row, CSV_ALIASES.cost_price)),
      sale_price: toNumber(getField(row, CSV_ALIASES.sale_price)),
      current_stock: toNumber(getField(row, CSV_ALIASES.current_stock)),
      min_stock: toNumber(getField(row, CSV_ALIASES.min_stock)),
      status: getField(row, CSV_ALIASES.status) || "Activo",
      image_url: getField(row, CSV_ALIASES.image_url),
      department_id: toNumber(getField(row, CSV_ALIASES.department_id), null),
    };
  });
}

export function findImageFile(imagePath, imageFiles) {
  const wantedPath = normalizePath(imagePath);
  const wantedFileName = fileNameFromPath(imagePath);

  return Array.from(imageFiles || []).find((file) => {
    const relativePath = normalizePath(file.webkitRelativePath || file.name);
    const fileName = normalizePath(file.name);

    return relativePath === wantedPath || fileName === wantedFileName;
  });
}

export async function uploadProductsFromCsv(csvFile, imageFiles = [], options = {}) {
  const {
    bucketName = "Products",
    encoding = "auto",
    beforeEach = async () => true,
    onProgress = () => {},
  } = options;

  const csvText = await readCsvText(csvFile, encoding);
  const products = parseProductsCsv(csvText);
  const results = [];

  for (const product of products) {
    const shouldContinue = await beforeEach(product);

    if (!shouldContinue) {
      results.push({
        ok: false,
        cancelled: true,
        rowNumber: product.rowNumber,
        productName: product.product_name,
      });
      break;
    }

    try {
      if (!product.product_name) throw new Error("El producto no tiene nombre.");
      if (!product.supplier_id) throw new Error("El producto no tiene supplier_id valido.");

      const imageFile = findImageFile(product.image_url, imageFiles);

      if (!imageFile) {
        throw new Error(`No encontre la imagen local indicada en image_url: ${product.image_url}`);
      }

      onProgress(`Fila ${product.rowNumber}: subiendo imagen ${imageFile.name}`);
      const uploadedImageUrl = await upload_image(imageFile, bucketName);

      if (!uploadedImageUrl) {
        throw new Error(`No se pudo subir la imagen ${imageFile.name}.`);
      }

      onProgress(`Fila ${product.rowNumber}: insertando ${product.product_name}`);
      const data = await insert_into_products(
        product.product_name, 
        product.description,
        product.supplier_id,
        product.cost_price,
        product.sale_price,
        product.current_stock,
        product.min_stock,
        product.status,
        uploadedImageUrl,
        product.department_id
      );

      results.push({
        ok: true,
        rowNumber: product.rowNumber,
        productName: product.product_name,
        imageUrl: uploadedImageUrl,
        data,
      });
    } catch (error) {
      results.push({
        ok: false,
        rowNumber: product.rowNumber,
        productName: product.product_name,
        error,
      });

      onProgress(`Fila ${product.rowNumber}: ERROR - ${error.message}`);
    }
  }

  return results;
}
