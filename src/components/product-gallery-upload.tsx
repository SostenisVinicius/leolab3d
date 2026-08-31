"use client";

import { upload } from "@vercel/blob/client";
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { validateImageFile } from "@/lib/image-upload";
import { MAX_GALLERY_IMAGES } from "@/lib/product-gallery";

type GalleryItem = { url: string; alt: string };

export function ProductGalleryUpload({ initialImages }: { initialImages?: GalleryItem[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryItem[]>(initialImages ?? []);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");

  const remaining = MAX_GALLERY_IMAGES - images.length;

  async function uploadFiles(fileList?: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    setError("");

    if (files.length > remaining) {
      setError(`Você pode enviar no máximo ${MAX_GALLERY_IMAGES} fotos. Envie ${remaining} agora.`);
    }
    const accepted = files.slice(0, Math.max(remaining, 0));
    if (!accepted.length) return;

    setPending(accepted.length);
    for (const file of accepted) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(`${file.name}: ${validationError}`);
        setPending((count) => count - 1);
        continue;
      }
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const blob = await upload(`products/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          contentType: file.type,
        });
        setImages((current) =>
          current.some((image) => image.url === blob.url)
            ? current
            : [...current, { url: blob.url, alt: "" }],
        );
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : `Não foi possível enviar ${file.name}.`,
        );
      } finally {
        setPending((count) => count - 1);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, direction: -1 | 1) {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="image-upload-field">
      <span className="field-label">Fotos adicionais</span>
      <p className="field-hint">
        Aparecem na página da peça junto com a capa. Até {MAX_GALLERY_IMAGES} fotos.
      </p>

      {images.map((image, index) => (
        <div className="gallery-item" key={image.url}>
          <span className="gallery-thumb" style={{ backgroundImage: `url(${image.url})` }} />
          <div className="gallery-fields">
            {/* A ordem destes campos no DOM define a ordem gravada em product_images. */}
            <input type="hidden" name="galleryUrl" value={image.url} />
            <label>
              Texto alternativo
              <input
                name="galleryAlt"
                value={image.alt}
                placeholder="Descreva a foto para leitores de tela"
                onChange={(event) =>
                  setImages((current) =>
                    current.map((item, position) =>
                      position === index ? { ...item, alt: event.target.value } : item,
                    ),
                  )
                }
              />
            </label>
            <div className="gallery-actions">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Mover a foto ${index + 1} para cima`}
              >
                <ArrowUp />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === images.length - 1}
                aria-label={`Mover a foto ${index + 1} para baixo`}
              >
                <ArrowDown />
              </button>
              <button
                type="button"
                className="remove-image"
                onClick={() =>
                  setImages((current) => current.filter((_, position) => position !== index))
                }
              >
                <Trash2 /> Remover
              </button>
            </div>
          </div>
        </div>
      ))}

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void uploadFiles(event.target.files)}
      />
      <button
        type="button"
        className={`upload-box interactive gallery-add ${dragging ? "dragging" : ""}`}
        onClick={() => !pending && remaining > 0 && inputRef.current?.click()}
        disabled={remaining <= 0}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void uploadFiles(event.dataTransfer.files);
        }}
      >
        {pending > 0 ? (
          <>
            <LoaderCircle className="spin" />
            <strong>
              Enviando {pending} {pending === 1 ? "foto" : "fotos"}...
            </strong>
          </>
        ) : (
          <>
            <ImagePlus />
            <strong>
              {remaining > 0 ? "Adicionar fotos" : `Limite de ${MAX_GALLERY_IMAGES} fotos atingido`}
            </strong>
            {remaining > 0 && <span>Selecione ou arraste várias de uma vez</span>}
          </>
        )}
      </button>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
