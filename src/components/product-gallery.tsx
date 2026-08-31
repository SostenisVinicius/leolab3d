"use client";

import { useState } from "react";

export type ProductPhoto = { url: string; alt: string };

export function ProductGallery({ photos, tag }: { photos: ProductPhoto[]; tag: string }) {
  const [active, setActive] = useState(0);
  const current = photos[active];

  return (
    <div className="detail-gallery">
      <div
        className="detail-image"
        style={{ backgroundImage: current ? `url(${current.url})` : undefined }}
        role="img"
        aria-label={current?.alt ?? tag}
      >
        <span>{tag}</span>
      </div>
      {photos.length > 1 && (
        <div className="detail-thumbs" role="group" aria-label="Fotos da peça">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.url}
              className={index === active ? "active" : ""}
              style={{ backgroundImage: `url(${photo.url})` }}
              aria-label={`Ver foto ${index + 1} de ${photos.length}: ${photo.alt}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
