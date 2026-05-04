import { get_user_profile, send_email } from "../authentication/db_functions";

export function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

export function pdfToBase64(doc) {
  return doc.output("datauristring").split(",")[1];
}

function escapeCsvValue(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function rowsToCsv(columns, rows) {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(",");
  const body = rows.map((row) =>
    columns
      .map((column) => {
        const value =
          typeof column.value === "function"
            ? column.value(row)
            : row[column.value];

        return escapeCsvValue(value);
      })
      .join(",")
  );

  return [header, ...body].join("\n");
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function getAdminAlertsEmail(userId) {
  const profile = await get_user_profile(userId);
  const userProfile = Array.isArray(profile) ? profile[0] : profile;

  return userProfile?.alerts_email || userProfile?.internal_email || "";
}

export async function sendCsvEmail({
  to,
  filename,
  title,
  columns,
  rows,
}) {
  const csv = rowsToCsv(columns, rows);

  return send_email({
    to,
    subject: title,
    message: `
      <h2>${title}</h2>
      <p>Adjunto encontrarás el archivo CSV generado desde Ferretería Elupina.</p>
    `,
    html: true,
    attachments: [
      {
        filename,
        content_type: "text/csv",
        base64: textToBase64(csv),
      },
    ],
  });
}

export function createPdfAttachment(doc, filename) {
  return {
    filename,
    content_type: "application/pdf",
    base64: pdfToBase64(doc),
  };
}
