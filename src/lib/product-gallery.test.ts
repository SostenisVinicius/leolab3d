import { describe, expect, it } from "vitest";
import { findOrphanImages, MAX_GALLERY_IMAGES, normalizeGallery } from "./product-gallery";

const url = (n: number) => `https://abc.public.blob.vercel-storage.com/products/${n}.png`;

describe("normalizeGallery", () => {
  it("aceita várias fotos preservando a ordem enviada", () => {
    const images = normalizeGallery({
      urls: [url(1), url(2), url(3)],
      alts: ["frente", "lado", "verso"],
      fallbackAlt: "Totem",
    });
    expect(images).toEqual([
      { url: url(1), alt: "frente", displayOrder: 0 },
      { url: url(2), alt: "lado", displayOrder: 1 },
      { url: url(3), alt: "verso", displayOrder: 2 },
    ]);
  });

  it("usa o nome do produto quando o texto alternativo fica em branco", () => {
    const [image] = normalizeGallery({ urls: [url(1)], alts: ["  "], fallbackAlt: "Totem" });
    expect(image.alt).toBe("Totem");
  });

  it("usa o nome do produto quando não há texto alternativo correspondente", () => {
    const [, second] = normalizeGallery({
      urls: [url(1), url(2)],
      alts: ["frente"],
      fallbackAlt: "Totem",
    });
    expect(second.alt).toBe("Totem");
  });

  it("descarta entradas vazias sem abrir buracos na ordem", () => {
    const images = normalizeGallery({
      urls: ["", url(1), "   ", url(2)],
      alts: ["", "frente", "", "verso"],
      fallbackAlt: "Totem",
    });
    expect(images.map((image) => image.displayOrder)).toEqual([0, 1]);
    expect(images.map((image) => image.alt)).toEqual(["frente", "verso"]);
  });

  it("ignora a mesma foto enviada duas vezes", () => {
    const images = normalizeGallery({ urls: [url(1), url(1)], fallbackAlt: "Totem" });
    expect(images).toHaveLength(1);
  });

  it("respeita o limite de fotos", () => {
    const urls = Array.from({ length: MAX_GALLERY_IMAGES + 3 }, (_, index) => url(index));
    expect(normalizeGallery({ urls, fallbackAlt: "Totem" })).toHaveLength(MAX_GALLERY_IMAGES);
  });

  it("aceita produto sem nenhuma foto adicional", () => {
    expect(normalizeGallery({ urls: [], fallbackAlt: "Totem" })).toEqual([]);
  });
});

describe("findOrphanImages", () => {
  it("aponta apenas as fotos que saíram do produto", () => {
    expect(findOrphanImages([url(1), url(2), url(3)], [url(1), url(3)])).toEqual([url(2)]);
  });

  it("não considera órfã a capa que virou foto da galeria", () => {
    expect(findOrphanImages([url(1)], [null, url(1)])).toEqual([]);
  });

  it("trata ausência de imagens anteriores", () => {
    expect(findOrphanImages([null], [url(1)])).toEqual([]);
  });

  it("marca todas como órfãs quando o produto perde as imagens", () => {
    expect(findOrphanImages([url(1), url(2)], [null])).toEqual([url(1), url(2)]);
  });
});
