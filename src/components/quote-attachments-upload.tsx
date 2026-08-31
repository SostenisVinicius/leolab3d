"use client";

import { upload } from "@vercel/blob/client";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { validateImageFile } from "@/lib/image-upload";
import {
  isValidQuotePhone,
  MAX_QUOTE_ATTACHMENTS,
  quoteUploadFolder,
  type QuoteAttachmentInput,
} from "@/lib/quote-attachments";

export function QuoteAttachmentsUpload({ phone }: { phone: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<QuoteAttachmentInput[]>([]);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");

  const phoneReady = isValidQuotePhone(phone);
  const remaining = MAX_QUOTE_ATTACHMENTS - files.length;
  const disabled = !phoneReady || remaining <= 0;

  async function uploadFiles(fileList?: FileList | null) {
    const selected = Array.from(fileList ?? []);
    if (!selected.length) return;
    setError("");

    if (!phoneReady) {
      setError("Informe seu WhatsApp antes de anexar as referências.");
      return;
    }
    if (selected.length > remaining) {
      setError(
        `São no máximo ${MAX_QUOTE_ATTACHMENTS} imagens. ${
          remaining > 0 ? `Cabem mais ${remaining}.` : "O limite já foi atingido."
        }`,
      );
    }
    const accepted = selected.slice(0, Math.max(remaining, 0));
    if (!accepted.length) return;

    const folder = quoteUploadFolder(phone);
    setPending(accepted.length);
    for (const file of accepted) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(`${file.name}: ${validationError}`);
        setPending((count) => count - 1);
        continue;
      }
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-90);
        const blob = await upload(`${folder}/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          contentType: file.type,
        });
        setFiles((current) =>
          current.some((item) => item.url === blob.url)
            ? current
            : [
                ...current,
                {
                  url: blob.url,
                  fileName: file.name,
                  contentType: file.type,
                  size: file.size,
                },
              ],
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

  return (
    <div className="full quote-attachments">
      <span className="field-label">
        Referências visuais <span className="optional">(opcional)</span>
      </span>
      <p className="field-hint">
        Fotos, desenhos ou inspirações ajudam bastante na análise. Até {MAX_QUOTE_ATTACHMENTS}{" "}
        imagens JPG, PNG ou WEBP de 8 MB.
      </p>

      {files.length > 0 && (
        <ul className="attachment-list">
          {files.map((file, index) => (
            <li key={file.url}>
              <span className="attachment-thumb" style={{ backgroundImage: `url(${file.url})` }} />
              <input type="hidden" name="attachmentUrl" value={file.url} />
              <input type="hidden" name="attachmentName" value={file.fileName} />
              <input type="hidden" name="attachmentType" value={file.contentType} />
              <input type="hidden" name="attachmentSize" value={file.size} />
              <span className="attachment-name">{file.fileName}</span>
              <button
                type="button"
                className="remove-image"
                aria-label={`Remover ${file.fileName}`}
                onClick={() =>
                  setFiles((current) => current.filter((_, position) => position !== index))
                }
              >
                <Trash2 />
              </button>
            </li>
          ))}
        </ul>
      )}

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
        className={`upload-box interactive ${dragging ? "dragging" : ""}`}
        disabled={disabled}
        onClick={() => !pending && !disabled && inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) void uploadFiles(event.dataTransfer.files);
        }}
      >
        {pending > 0 ? (
          <>
            <LoaderCircle className="spin" />
            <strong>
              Enviando {pending} {pending === 1 ? "imagem" : "imagens"}...
            </strong>
          </>
        ) : (
          <>
            <ImagePlus />
            <strong>
              {!phoneReady
                ? "Informe seu WhatsApp para anexar"
                : remaining <= 0
                  ? `Limite de ${MAX_QUOTE_ATTACHMENTS} imagens atingido`
                  : dragging
                    ? "Solte as imagens aqui"
                    : "Arraste ou clique para enviar"}
            </strong>
            {phoneReady && remaining > 0 && (
              <span>
                {remaining} {remaining === 1 ? "imagem restante" : "imagens restantes"}
              </span>
            )}
          </>
        )}
      </button>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
