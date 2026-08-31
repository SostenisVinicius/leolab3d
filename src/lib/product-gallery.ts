export const MAX_GALLERY_IMAGES = 8;

export type GalleryImage = { url: string; alt: string; displayOrder: number };

/**
 * Normaliza as fotos enviadas pelo formulário: descarta vazios e repetidos,
 * completa o texto alternativo e fixa a ordem de exibição.
 */
export function normalizeGallery({
  urls,
  alts = [],
  fallbackAlt,
}: {
  urls: Array<string | null | undefined>;
  alts?: Array<string | null | undefined>;
  fallbackAlt: string;
}): GalleryImage[] {
  const seen = new Set<string>();
  const images: GalleryImage[] = [];
  urls.forEach((rawUrl, index) => {
    const url = (rawUrl ?? "").trim();
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push({
      url,
      alt: (alts[index] ?? "").trim() || fallbackAlt,
      displayOrder: images.length,
    });
  });
  return images.slice(0, MAX_GALLERY_IMAGES);
}

/** URLs que deixaram de ser referenciadas e podem ser removidas do Blob. */
export function findOrphanImages(previous: Array<string | null>, current: Array<string | null>) {
  const kept = new Set(current.filter(Boolean) as string[]);
  return [...new Set(previous.filter(Boolean) as string[])].filter((url) => !kept.has(url));
}
