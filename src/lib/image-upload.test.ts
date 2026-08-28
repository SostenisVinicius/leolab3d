import { describe, expect, it } from "vitest";
import { IMAGE_UPLOAD_MAX_SIZE, validateImageFile } from "./image-upload";

describe("validateImageFile", () => {
  it("aceita imagens suportadas dentro do limite", () => {
    expect(validateImageFile({ type: "image/webp", size: 1024 })).toBeNull();
  });

  it("rejeita formatos não suportados", () => {
    expect(validateImageFile({ type: "application/pdf", size: 1024 })).toContain("JPG");
  });

  it("rejeita imagens maiores que 8 MB", () => {
    expect(validateImageFile({ type: "image/png", size: IMAGE_UPLOAD_MAX_SIZE + 1 })).toContain(
      "8 MB",
    );
  });
});
