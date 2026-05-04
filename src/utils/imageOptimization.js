import heic2any from "heic2any";

const MAX_FILE_SIZE_KB = 999;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1000;
const MIN_LONGEST_SIDE = 160;

export async function optimize_image(file, options = {}) {
  const {
    max_width = 1200,
    max_height = 1200,
    initial_quality = 0.85,
    min_quality = 0.45,
    quality_step = 0.07,
    output_type = "image/jpeg",
  } = options;

  if (!file) {
    throw new Error("No image file provided.");
  }

  const normalized_file = await normalize_image_file(file);

  const image = await load_image(normalized_file);

  let { width, height } = calculate_size(
    image.width,
    image.height,
    max_width,
    max_height
  );

  let quality = initial_quality;
  let blob = null;

  while (quality >= min_quality) {
    blob = await canvas_to_blob(image, width, height, output_type, quality);

    if (blob.size <= MAX_FILE_SIZE_BYTES) {
      break;
    }

    quality -= quality_step;
  }

  while (blob.size > MAX_FILE_SIZE_BYTES && Math.max(width, height) > MIN_LONGEST_SIDE) {
    const longest_side = Math.max(width, height);
    const next_longest_side = Math.max(
      Math.round(longest_side * 0.8),
      MIN_LONGEST_SIDE
    );
    const scale = next_longest_side / longest_side;

    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));

    blob = await canvas_to_blob(
      image,
      width,
      height,
      output_type,
      min_quality
    );
  }

  if (!blob || blob.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      "The image could not be compressed below 999 KB. Please choose a smaller image."
    );
  }

  const optimized_file = new File(
    [blob],
    create_file_name(file.name, "jpg"),
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );

  return {
    file: optimized_file,
    original_size_kb: bytes_to_kb(file.size),
    optimized_size_kb: bytes_to_kb(optimized_file.size),
    width,
    height,
    type: optimized_file.type,
    name: optimized_file.name,
  };
}

async function normalize_image_file(file) {
  const file_name = file.name.toLowerCase();

  const is_heic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file_name.endsWith(".heic") ||
    file_name.endsWith(".heif");

  if (!is_heic) {
    return file;
  }

  try {
    const converted_blob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const final_blob = Array.isArray(converted_blob)
      ? converted_blob[0]
      : converted_blob;

    return new File(
      [final_blob],
      create_file_name(file.name, "jpg"),
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  } catch (error) {
    console.error("HEIC conversion failed:", error);

    throw new Error(
      "This iPhone image could not be processed. Please upload the image as JPG, PNG, or WEBP."
    );
  }
}

function load_image(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const image_url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(image_url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(image_url);
      reject(new Error("Could not load this image."));
    };

    image.src = image_url;
  });
}

function calculate_size(original_width, original_height, max_width, max_height) {
  let width = original_width;
  let height = original_height;

  if (width > max_width) {
    height = Math.round((height * max_width) / width);
    width = max_width;
  }

  if (height > max_height) {
    width = Math.round((width * max_height) / height);
    height = max_height;
  }

  return { width, height };
}

function canvas_to_blob(image, width, height, output_type, quality) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      reject(new Error("Canvas is not supported in this browser."));
      return;
    }

    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }

        resolve(blob);
      },
      output_type,
      quality
    );
  });
}

function create_file_name(file_name, extension) {
  const clean_name = file_name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9_-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${clean_name || "image"}-optimized.${extension}`;
}

function bytes_to_kb(bytes) {
  return Number((bytes / 1024).toFixed(2));
}
