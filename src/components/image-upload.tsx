"use client";

import { upload } from "@vercel/blob/client";
import { ImageIcon, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { validateImageFile } from "@/lib/image-upload";

export function ImageUpload({
  name,
  folder,
  initialUrl,
  label = "Imagem de capa",
}: {
  name: string;
  folder: "products" | "collections";
  initialUrl?: string | null;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function uploadFile(file?: File) {
    if (!file) return;
    setError("");
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const blob = await upload(`${folder}/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        contentType: file.type,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      setUrl(blob.url);
      setProgress(100);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Não foi possível enviar a imagem.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="image-upload-field">
      <span className="field-label">{label}</span>
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void uploadFile(event.target.files?.[0])}
      />
      <button
        type="button"
        className={`upload-box interactive ${dragging ? "dragging" : ""} ${url ? "has-image" : ""}`}
        onClick={() => !uploading && inputRef.current?.click()}
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
          void uploadFile(event.dataTransfer.files?.[0]);
        }}
      >
        {url ? (
          <span className="upload-preview" style={{ backgroundImage: `url(${url})` }}>
            <span>Trocar imagem</span>
          </span>
        ) : uploading ? (
          <>
            <LoaderCircle className="spin" />
            <strong>Enviando... {progress}%</strong>
          </>
        ) : (
          <>
            {dragging ? <ImageIcon /> : <UploadCloud />}
            <strong>{dragging ? "Solte a imagem aqui" : "Arraste ou clique para enviar"}</strong>
            <span>JPG, PNG ou WEBP · até 8 MB</span>
          </>
        )}
      </button>
      {uploading && (
        <div className="upload-progress" aria-label={`Upload em ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      {url && !uploading && (
        <button type="button" className="remove-image" onClick={() => setUrl("")}>
          <Trash2 /> Remover imagem
        </button>
      )}
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
