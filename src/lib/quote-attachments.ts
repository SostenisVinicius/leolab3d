export const MAX_QUOTE_ATTACHMENTS = 6;

export type QuoteAttachmentInput = {
  url: string;
  fileName: string;
  contentType: string;
  size: number;
};

/** Só dígitos, para usar o WhatsApp como pasta e vínculo do upload. */
export function normalizePhone(phone?: string | null) {
  return (phone ?? "").replace(/\D/g, "");
}

export function isValidQuotePhone(phone?: string | null) {
  const digits = normalizePhone(phone);
  return digits.length >= 10 && digits.length <= 13;
}

/** Pasta do Blob onde ficam as referências de um solicitante. */
export function quoteUploadFolder(phone: string) {
  return `quotes/${normalizePhone(phone)}`;
}

/**
 * Caminhos aceitos sem sessão administrativa: apenas referências de orçamento,
 * dentro da pasta de um WhatsApp válido.
 */
export function isPublicQuoteUploadPath(pathname: string) {
  return /^quotes\/\d{10,13}\/[A-Za-z0-9._-]{1,120}$/.test(pathname);
}

/** Monta os anexos recebidos do formulário, sem repetidos e dentro do limite. */
export function normalizeQuoteAttachments(raw: {
  urls: Array<string | null | undefined>;
  names: Array<string | null | undefined>;
  types: Array<string | null | undefined>;
  sizes: Array<string | number | null | undefined>;
}): QuoteAttachmentInput[] {
  const seen = new Set<string>();
  const attachments: QuoteAttachmentInput[] = [];
  raw.urls.forEach((rawUrl, index) => {
    const url = (rawUrl ?? "").trim();
    if (!url || seen.has(url)) return;
    seen.add(url);
    const size = Number(raw.sizes[index] ?? 0);
    attachments.push({
      url,
      fileName: (raw.names[index] ?? "").trim() || "referencia",
      contentType: (raw.types[index] ?? "").trim() || "application/octet-stream",
      size: Number.isSafeInteger(size) && size > 0 ? size : 0,
    });
  });
  return attachments.slice(0, MAX_QUOTE_ATTACHMENTS);
}
