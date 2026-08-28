export const IMAGE_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_UPLOAD_MAX_SIZE = 8 * 1024 * 1024;

const BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

/** Indica se a URL aponta para o Vercel Blob da aplicação e pode ser removida com `del`. */
export function isManagedBlobUrl(url?: string | null) {
  if (!url) return false;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

export function validateImageFile(file: Pick<File, "type" | "size">) {
  if (!IMAGE_UPLOAD_TYPES.includes(file.type as (typeof IMAGE_UPLOAD_TYPES)[number])) {
    return "Use uma imagem JPG, PNG ou WEBP.";
  }
  if (file.size > IMAGE_UPLOAD_MAX_SIZE) {
    return "A imagem deve ter no máximo 8 MB.";
  }
  return null;
}
