export const IMAGE_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_UPLOAD_MAX_SIZE = 8 * 1024 * 1024;

export function validateImageFile(file: Pick<File, "type" | "size">) {
  if (!IMAGE_UPLOAD_TYPES.includes(file.type as (typeof IMAGE_UPLOAD_TYPES)[number])) {
    return "Use uma imagem JPG, PNG ou WEBP.";
  }
  if (file.size > IMAGE_UPLOAD_MAX_SIZE) {
    return "A imagem deve ter no máximo 8 MB.";
  }
  return null;
}
