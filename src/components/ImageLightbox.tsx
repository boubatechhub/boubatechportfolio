import { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type ImageLightboxProps = {
  images: string[];
  index: number;
  alts?: string[];
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function ImageLightbox({
  images,
  index,
  alts,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const src = images[index];
  const hasMultiple = images.length > 1;
  const alt = alts?.[index] ?? `Image ${index + 1}`;

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && hasMultiple) goPrev();
      if (event.key === 'ArrowRight' && hasMultiple) goNext();
    };

    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext, hasMultiple]);

  if (!src) return null;

  const navBtnClass =
    'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#17120e]/80 text-[#f5f5f0]/90 backdrop-blur-sm transition-colors hover:border-brand-orange/40 hover:bg-[#17120e] hover:text-[#f5f5f0] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#17120e]/95 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse d'images"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#17120e]/80 text-[#f5f5f0]/90 backdrop-blur-sm transition-colors hover:border-brand-orange/40 hover:text-[#f5f5f0] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        aria-label="Fermer"
      >
        <X size={20} aria-hidden />
      </button>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className={`${navBtnClass} left-3 sm:left-6`}
            aria-label="Image précédente"
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className={`${navBtnClass} right-3 sm:right-6`}
            aria-label="Image suivante"
          >
            <ChevronRight size={22} aria-hidden />
          </button>
        </>
      ) : null}

      <figure
        className="relative flex max-h-full max-w-full flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[min(85vh,900px)] max-w-[min(92vw,1200px)] object-contain"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        {hasMultiple ? (
          <figcaption className="mt-4 font-mono text-caption-sm uppercase tracking-widest text-[#f5f5f0]/70">
            {index + 1} / {images.length}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}

export type LightboxState = {
  images: string[];
  index: number;
  alts: string[];
};
