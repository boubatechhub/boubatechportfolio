import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Figma,
} from "lucide-react";
import { SiteShapeGridBackground } from "../SiteShapeGridBackground";
import { ImageLightbox, type LightboxState } from "../ImageLightbox";
import type { ContentWork } from "../../types";
import { CONTENT_WORKS } from "../../constants";
import { PAGE_CONTAINER_CLASS } from "../../layout";
import { fetchAllRows } from "../../services/supabaseDb";
import { isSupabaseConfigured } from "../../services/supabase";
import { getDirectImageUrl, normalizeStringArray } from "../../utils";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function imageSrc(url: string): string {
  const raw = getDirectImageUrl(url);
  if (!raw || raw.includes("picsum.photos") || raw.includes("giphy.com")) {
    return "";
  }
  return raw;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const surfaceCard =
  "rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/30";

function BackLink() {
  return (
    <Link
      to="/#créations"
      className="group inline-flex items-center gap-2.5 font-mono text-caption uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:text-brand-orange"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors group-hover:border-brand-orange/30">
        <ArrowLeft size={15} aria-hidden />
      </span>
      Designs UI/UX
    </Link>
  );
}

function UiUxPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen text-white">
      <SiteShapeGridBackground />
      <div className="relative z-[1]">{children}</div>
    </main>
  );
}

function LinkPill({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof ExternalLink;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="site-button inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 font-mono text-caption uppercase tracking-wider text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
    >
      {label}
      <Icon size={14} aria-hidden />
      <ArrowUpRight size={12} className="text-white/35" aria-hidden />
    </a>
  );
}

export function UiUxCaseStudyPage() {
  const { id } = useParams();
  const reduceMotion = usePrefersReducedMotion();
  const [loading, setLoading] = useState(true);
  const [works, setWorks] = useState<ContentWork[]>([]);
  const [work, setWork] = useState<ContentWork | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      setCoverError(false);
      try {
        const rows = isSupabaseConfigured
          ? await fetchAllRows<ContentWork>("content_works")
          : CONTENT_WORKS;
        if (cancelled) return;
        setWorks(rows);
        setWork(rows.find((r) => String(r.id) === String(id)) ?? null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erreur de chargement.");
          setWork(null);
          setWorks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const cover = work?.imageUrl ? imageSrc(work.imageUrl) : "";
  const showCover = Boolean(cover) && !coverError;

  const gallery = useMemo(() => {
    const extra = normalizeStringArray(work?.images)
      .map(imageSrc)
      .filter(Boolean);
    const base = cover ? [cover] : [];
    return Array.from(new Set([...base, ...extra]));
  }, [work, cover]);

  const nextWork = useMemo(() => {
    if (!work || works.length < 2) return null;
    const idx = works.findIndex((w) => String(w.id) === String(work.id));
    if (idx < 0) return null;
    return works[(idx + 1) % works.length] ?? null;
  }, [work, works]);

  if (loading) {
    return (
      <UiUxPageShell>
        <div className={`${PAGE_CONTAINER_CLASS} pb-16 pt-10`}>
          <div className="mb-8 h-5 w-44 animate-pulse rounded-full bg-white/10" />
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:items-end">
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-14 w-full max-w-xl animate-pulse rounded-xl bg-white/[0.06]" />
              <div className="h-20 w-full max-w-lg animate-pulse rounded-xl bg-white/[0.04]" />
            </div>
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-white/[0.05] lg:aspect-[16/11]" />
          </div>
        </div>
      </UiUxPageShell>
    );
  }

  if (error) {
    return (
      <UiUxPageShell>
        <div className={`${PAGE_CONTAINER_CLASS} pb-16 pt-10`}>
          <BackLink />
          <p className="mt-8 text-sm text-red-400/90" role="alert">
            {error}
          </p>
        </div>
      </UiUxPageShell>
    );
  }

  if (!work) {
    return (
      <UiUxPageShell>
        <div className={`${PAGE_CONTAINER_CLASS} pb-16 pt-10`}>
          <BackLink />
          <p className="mt-8 text-sm text-white/55">
            Ce design n&apos;existe pas ou n&apos;est plus disponible.
          </p>
        </div>
      </UiUxPageShell>
    );
  }

  const figma = work.figmaUrl?.trim() ? work.figmaUrl.trim() : "";
  const live = work.link?.trim() ? work.link.trim() : "";
  const externalLinks = [
    figma ? { href: figma, label: "Figma", icon: Figma } : null,
    live ? { href: live, label: "Prototype", icon: ExternalLink } : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: typeof ExternalLink;
  }[];

  const galleryAlts = gallery.map(
    (_, i) => `Design ${i + 1} — ${work.title}`,
  );

  const openLightbox = (index: number) => {
    setLightbox({ images: gallery, index, alts: galleryAlts });
  };

  return (
    <UiUxPageShell>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div
          className={`${PAGE_CONTAINER_CLASS} flex items-center justify-between gap-4 py-4 md:py-5`}
        >
          <BackLink />
          {externalLinks.length > 0 ? (
            <nav
              className="hidden items-center gap-2 sm:flex"
              aria-label="Liens du design"
            >
              {externalLinks.map((item) => (
                <LinkPill key={item.label} {...item} />
              ))}
            </nav>
          ) : (
            <span className="hidden font-mono text-caption text-white/25 sm:block">
              Case study UI/UX
            </span>
          )}
        </div>
      </header>

      <article>
        <section
          className={`${PAGE_CONTAINER_CLASS} pb-14 pt-10 md:pb-20 md:pt-14`}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
            className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16"
          >
            <div className="min-w-0">
              <p className="mb-4 inline-flex items-center gap-2 font-mono text-caption-sm uppercase tracking-[0.24em] text-brand-orange">
                <span className="h-px w-8 bg-brand-orange/60" aria-hidden />
                {work.category || "Design UI/UX"}
              </p>
              <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-white">
                {work.title}
              </h1>
              {work.description ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                  {work.description}
                </p>
              ) : null}
              {externalLinks.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2 sm:hidden">
                  {externalLinks.map((item) => (
                    <LinkPill key={item.label} {...item} />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-white/[0.06]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-3 -top-3 h-full w-full rounded-2xl border border-brand-orange/20"
                aria-hidden
              />
              {showCover ? (
                <figure className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/60">
                  <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    className="group relative block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label={`Agrandir l'aperçu — ${work.title}`}
                  >
                    <img
                      src={cover}
                      alt={`Aperçu du design ${work.title}`}
                      className="aspect-[4/3] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] lg:aspect-[16/11]"
                      onError={() => setCoverError(true)}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </button>
                </figure>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] lg:aspect-[16/11]">
                  <span className="font-mono text-caption uppercase tracking-widest text-white/25">
                    Aperçu visuel
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {gallery.length > 0 ? (
          <section className="border-t border-white/[0.06]">
            <div className={`${PAGE_CONTAINER_CLASS} py-14 md:py-20`}>
              <motion.div
                {...(reduceMotion ? {} : fadeUp)}
                className="mb-8 flex items-end justify-between gap-4"
              >
                <div>
                  <p className="font-mono text-caption uppercase tracking-[0.2em] text-brand-orange/90">
                    01
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
                    Captures & écrans
                  </h2>
                </div>
                <span className="hidden font-mono text-caption text-white/25 md:block">
                  {String(gallery.length).padStart(2, "0")} images
                </span>
              </motion.div>

              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-5">
                {gallery.map((src, i) => (
                  <motion.figure
                    key={`${src}-${i}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: reduceMotion ? 0 : Math.min(i * 0.06, 0.36),
                      duration: 0.45,
                    }}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] lg:mb-5"
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(i)}
                      className="group block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange"
                      aria-label={`Agrandir ${galleryAlts[i]}`}
                    >
                      <img
                        src={src}
                        alt={galleryAlts[i]}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  </motion.figure>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="border-t border-white/[0.06]">
            <div className={`${PAGE_CONTAINER_CLASS} py-14 md:py-16`}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
                Ajoutez une image principale et/ou une galerie dans l&apos;admin.
              </div>
            </div>
          </section>
        )}

        <footer
          className={`${PAGE_CONTAINER_CLASS} border-t border-white/[0.06] py-12 md:py-16`}
        >
          <div
            className={`flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10 ${surfaceCard}`}
          >
            <div>
              <p className="font-mono text-caption uppercase tracking-[0.2em] text-white/40">
                Suite du parcours
              </p>
              <p className="mt-2 font-display text-xl text-white md:text-2xl">
                {nextWork
                  ? `Suivant — ${nextWork.title}`
                  : "Découvrir les autres designs"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {nextWork ? (
                <Link
                  to={`/uiux/${nextWork.id}`}
                  className="site-button group inline-flex items-center gap-3 rounded-full border border-brand-orange bg-brand-orange px-6 py-3.5 font-mono text-caption uppercase tracking-wider text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Design suivant
                  <ArrowLeft
                    size={16}
                    className="rotate-180 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              ) : null}
              <Link
                to="/#créations"
                className="site-button inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3.5 font-mono text-caption uppercase tracking-wider text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Tous les designs
              </Link>
            </div>
          </div>
        </footer>
      </article>

      {lightbox ? (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          alts={lightbox.alts}
          onClose={() => setLightbox(null)}
          onIndexChange={(index) =>
            setLightbox((prev) => (prev ? { ...prev, index } : null))
          }
        />
      ) : null}
    </UiUxPageShell>
  );
}
