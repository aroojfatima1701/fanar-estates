'use client';
import { useEffect, useState } from 'react';
import { IconClose } from './Icons';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, images.length]);

  const [main, ...rest] = images;
  return (
    <>
      <div className={`gallery gallery--${Math.min(images.length, 3)}`}>
        <button type="button" className="gallery__main" onClick={() => setOpen(0)} aria-label={`Open photo 1 of ${images.length}`}>
          <img src={main} alt={title} />
        </button>
        {rest.slice(0, 2).map((src, i) => (
          <button type="button" key={src} className="gallery__side" onClick={() => setOpen(i + 1)} aria-label={`Open photo ${i + 2} of ${images.length}`}>
            <img src={src} alt="" loading="lazy" />
            {i === 1 && images.length > 3 && <span className="gallery__more">+{images.length - 3} {images.length - 3 === 1 ? 'photo' : 'photos'}</span>}
          </button>
        ))}
        <button type="button" className="gallery__all" onClick={() => setOpen(0)}>View all {images.length} photos</button>
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} photos`}>
          <button type="button" className="lightbox__close" onClick={() => setOpen(null)} aria-label="Close photos"><IconClose /></button>
          <img src={images[open]} alt={`${title}, photo ${open + 1}`} />
          <div className="lightbox__bar">
            <button type="button" onClick={() => setOpen((open - 1 + images.length) % images.length)}>Previous</button>
            <span className="tabular">{open + 1} / {images.length}</span>
            <button type="button" onClick={() => setOpen((open + 1) % images.length)}>Next</button>
          </div>
        </div>
      )}
    </>
  );
}
