import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Github,
  AlertCircle,
  Figma,
  Code2,
} from 'lucide-react';
import { SEO, SEO_OG_IMAGE, SEO_PERSON } from '../../constants/seo';
import {
  getProjectPath,
  loadProjectBySlugOrId,
  loadPublishedProjects,
} from '../../services/projectsService';
import { applySeo } from '../../services/seo';
import type { Project } from '../../types';
import { PAGE_CONTAINER_CLASS } from '../../layout';
import { SiteShapeGridBackground } from '../SiteShapeGridBackground';
import { ImageLightbox, type LightboxState } from '../ImageLightbox';
import { getCodeRepoMeta, getDirectImageUrl } from '../../utils';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

function imageSrc(url: string): string {
  const raw = getDirectImageUrl(url);
  if (!raw || raw.includes('picsum.photos') || raw.includes('giphy.com')) {
    return '';
  }
  return raw;
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' as const },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const surfaceCard =
  'rounded-2xl border border-brand-orange/20 bg-white shadow-lg shadow-black/10';
const surfaceMuted = 'rounded-xl border border-black/10 bg-white';
const surfacePill =
  'border border-black/15 bg-white transition-colors hover:border-brand-orange/50 hover:bg-brand-orange/5';

function DetailShell({ children }: { children: ReactNode }) {
  return (
    <main className="project-case-study relative min-h-screen overflow-x-clip bg-white text-neutral-900">
      <SiteShapeGridBackground />
      <div className="relative z-[1]">{children}</div>
    </main>
  );
}

function BackLink() {
  return (
    <Link
      to="/#projets"
      className="group inline-flex items-center gap-2.5 font-mono text-caption uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:text-brand-orange"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${surfacePill} group-hover:text-brand-orange`}
      >
        <ArrowLeft size={15} aria-hidden />
      </span>
      Tous les projets
    </Link>
  );
}

function ProjectLinkPill({
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
      className={`site-button inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-caption uppercase tracking-wider text-neutral-700 ${surfacePill}`}
    >
      <Icon size={14} aria-hidden />
      {label}
      <ArrowUpRight size={12} className="text-neutral-500" aria-hidden />
    </a>
  );
}

function NarrativeBlock({
  index,
  title,
  accent = 'orange',
  children,
}: {
  index: string;
  title: string;
  accent?: 'orange' | 'blue';
  children: ReactNode;
}) {
  if (!children) return null;
  const accentClass = 'text-brand-orange/90';

  return (
    <motion.section {...fadeUp} className="relative">
      <div className="mb-5 flex items-baseline gap-4">
        <span
          className={`font-display text-4xl font-semibold leading-none md:text-5xl ${accentClass}`}
          aria-hidden
        >
          {index}
        </span>
        <h2 className="font-mono text-caption-sm uppercase tracking-[0.22em] text-neutral-600">
          {title}
        </h2>
      </div>
      <div className="text-base leading-[1.75] text-neutral-700 md:text-body-lg [&_p]:whitespace-pre-wrap">
        {children}
      </div>
    </motion.section>
  );
}

function InsightCard({
  label,
  title,
  accent,
  children,
}: {
  label: string;
  title: string;
  accent: 'problem' | 'solution';
  children: ReactNode;
}) {
  if (!children) return null;
  const isProblem = accent === 'problem';

  return (
    <motion.div
      {...fadeUp}
      className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
        isProblem
          ? 'border-brand-orange/35 bg-orange-50'
          : 'border-brand-orange/25 bg-white'
      }`}
    >
      <p
        className={`relative mb-2 font-mono text-caption uppercase tracking-[0.2em] ${
          'text-brand-orange'
        }`}
      >
        {label}
      </p>
      <h3 className="relative mb-4 font-display text-xl font-medium text-neutral-950 md:text-2xl">
        {title}
      </h3>
      <div className="relative text-sm leading-relaxed text-neutral-700 md:text-base [&_p]:whitespace-pre-wrap">
        {children}
      </div>
    </motion.div>
  );
}

function StateView({
  title,
  message,
  showIcon,
}: {
  title: string;
  message: string;
  showIcon?: boolean;
}) {
  return (
    <DetailShell>
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        {showIcon ? (
          <AlertCircle className="text-brand-orange" size={36} aria-hidden />
        ) : null}
        <h1 className="font-display text-2xl font-medium md:text-3xl">{title}</h1>
        <p className="max-w-md text-neutral-600">{message}</p>
        <BackLink />
      </div>
    </DetailShell>
  );
}

export function ProjectCaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const reduceMotion = usePrefersReducedMotion();
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const [row, published] = await Promise.all([
          loadProjectBySlugOrId(slug),
          loadPublishedProjects().catch(() => [] as Project[]),
        ]);
        if (cancelled) return;
        if (!row) {
          setNotFound(true);
          setProject(null);
          setNextProject(null);
        } else {
          setProject(row);
          const idx = published.findIndex((p) => p.id === row.id);
          if (idx >= 0 && published.length > 1) {
            setNextProject(published[(idx + 1) % published.length] ?? null);
          } else {
            setNextProject(null);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : 'Erreur de chargement du projet.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    setCoverError(false);
  }, [project?.id, project?.imageUrl]);

  useEffect(() => {
    if (notFound || (!loading && !project && !error)) {
      applySeo({
        title: SEO.projectNotFound.title,
        description: SEO.projectNotFound.description,
        canonicalPath: slug ? `/projets/${slug}` : '/projets',
        robots: 'noindex, follow',
        ogType: 'website',
        ogImage: SEO_OG_IMAGE,
        jsonLd: null,
      });
      return;
    }

    if (!project) return;

    const desc =
      project.shortDescription ||
      project.description?.slice(0, 160) ||
      `Découvrez le projet ${project.title} : ${project.category}. Technologies : ${project.stack.slice(0, 5).join(', ')}.`;

    applySeo({
      title: `${project.title} — Projet ${project.category} | ${SEO_PERSON.name}`,
      description: desc,
      canonicalPath: `/projets/${project.slug || project.id}`,
      robots: 'index, follow',
      ogType: 'article',
      ogImage: imageSrc(project.imageUrl) || SEO_OG_IMAGE,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: desc,
        genre: project.category,
        author: { '@type': 'Person', name: SEO_PERSON.name },
      },
    });
  }, [project, notFound, loading, error, slug]);

  if (loading) {
    return (
      <DetailShell>
        <div className={`${PAGE_CONTAINER_CLASS} py-8 md:py-12`}>
          <div className="mb-10 h-5 w-40 animate-pulse rounded-full bg-orange-100" />
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:items-end">
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-orange-100" />
              <div className="h-14 w-full max-w-xl animate-pulse rounded-xl bg-orange-100/70" />
              <div className="h-20 w-full max-w-lg animate-pulse rounded-xl bg-neutral-100" />
            </div>
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-orange-50 lg:aspect-[16/11]" />
          </div>
        </div>
      </DetailShell>
    );
  }

  if (error) {
    return (
      <StateView
        title="Erreur de chargement"
        message={error}
        showIcon
      />
    );
  }

  if (notFound || !project) {
    return (
      <StateView
        title="Projet introuvable"
        message="Ce projet n'existe pas ou n'est plus disponible."
      />
    );
  }

  const cover = imageSrc(project.imageUrl);
  const gallery = (project.images ?? []).map(imageSrc).filter(Boolean);
  const showCover = Boolean(cover) && !coverError;

  const openLightbox = (
    images: string[],
    index: number,
    alts: string[],
  ) => {
    setLightbox({ images, index, alts });
  };

  const galleryAlts = gallery.map(
    (_, i) => `Visuel ${i + 1} — ${project.title}`,
  );
  const lead =
    project.shortDescription ||
    project.description?.slice(0, 280) ||
    null;
  const metaLine = [project.period, project.role].filter(Boolean).join(' · ');
  const codeRepo = getCodeRepoMeta(project.githubUrl);
  const externalLinks = [
    project.link
      ? { href: project.link, label: 'Site live', icon: ExternalLink }
      : null,
    project.githubUrl && codeRepo
      ? {
          href: project.githubUrl,
          label: codeRepo.label,
          icon: codeRepo.kind === 'github' ? Github : Code2,
        }
      : null,
    project.figmaUrl
      ? { href: project.figmaUrl, label: 'Figma', icon: Figma }
      : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: typeof ExternalLink;
  }[];

  let sectionIndex = 0;
  const nextIndex = () => {
    sectionIndex += 1;
    return String(sectionIndex).padStart(2, '0');
  };

  return (
    <DetailShell>
      <header className="project-detail-header sticky top-0 z-40 border-b border-black/10 backdrop-blur-md">
        <div
          className={`${PAGE_CONTAINER_CLASS} flex items-center justify-between gap-4 py-4 md:py-5`}
        >
          <BackLink />
          {externalLinks.length > 0 ? (
            <nav
              className="hidden items-center gap-2 sm:flex"
              aria-label="Liens du projet"
            >
              {externalLinks.map((item) => (
                <ProjectLinkPill key={item.label} {...item} />
              ))}
            </nav>
          ) : (
            <span className="hidden font-mono text-caption text-neutral-500 sm:block">
              Case study
            </span>
          )}
        </div>
      </header>

      <article>
        <section className={`${PAGE_CONTAINER_CLASS} pt-10 pb-14 md:pt-14 md:pb-20`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16 lg:items-end"
          >
            <div className="min-w-0">
              <p className="mb-4 inline-flex items-center gap-2 font-mono text-caption-sm uppercase tracking-[0.24em] text-brand-orange">
                <span className="h-px w-8 bg-brand-orange/60" aria-hidden />
                {project.category}
              </p>
              <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-neutral-950">
                {project.title}
              </h1>
              {metaLine ? (
                <p className="mt-4 font-mono text-caption uppercase tracking-widest text-neutral-600">
                  {metaLine}
                </p>
              ) : null}
              {lead ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg">
                  {lead}
                </p>
              ) : null}
              {externalLinks.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2 sm:hidden">
                  {externalLinks.map((item) => (
                    <ProjectLinkPill key={item.label} {...item} />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-black/[0.06]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-3 -top-3 h-full w-full rounded-2xl border border-brand-orange/20"
                aria-hidden
              />
              {showCover ? (
                <figure className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#0a0a0a] shadow-2xl shadow-black/20">
                  <button
                    type="button"
                    onClick={() =>
                      openLightbox(
                        [cover],
                        0,
                        [`Aperçu du projet ${project.title}`],
                      )
                    }
                    className="group relative block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    aria-label={`Agrandir l'aperçu — ${project.title}`}
                  >
                    <img
                      src={cover}
                      alt={`Aperçu du projet ${project.title}`}
                      className="aspect-[4/3] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] lg:aspect-[16/11]"
                      onError={() => setCoverError(true)}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                  </button>
                </figure>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-black/15 bg-orange-50 lg:aspect-[16/11]">
                  <span className="font-mono text-caption uppercase tracking-widest text-neutral-500">
                    Aperçu visuel
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        <section className="border-t border-black/[0.08]">
          <div
            className={`${PAGE_CONTAINER_CLASS} grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-16 xl:gap-20`}
          >
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <motion.div
                {...fadeUp}
                className={`space-y-8 p-6 md:p-7 ${surfaceCard}`}
              >
                <div>
                  <p className="mb-3 font-mono text-caption uppercase tracking-[0.2em] text-neutral-600">
                    Stack
                  </p>
                  {project.stack.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li key={tech}>
                          <span className="inline-block rounded-lg border border-brand-orange/20 bg-brand-orange/5 px-2.5 py-1 font-mono text-caption text-neutral-800">
                            {tech}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-700">—</p>
                  )}
                </div>

                {(project.period || project.role) && (
                  <div className="border-t border-black/10 pt-6">
                    <p className="mb-3 font-mono text-caption uppercase tracking-[0.2em] text-neutral-600">
                      Infos
                    </p>
                    <dl className="space-y-3 text-sm">
                      {project.role ? (
                        <div>
                          <dt className="text-neutral-600">Rôle</dt>
                          <dd className="mt-0.5 text-neutral-900">{project.role}</dd>
                        </div>
                      ) : null}
                      {project.period ? (
                        <div>
                          <dt className="text-neutral-600">Période</dt>
                          <dd className="mt-0.5 text-neutral-900">{project.period}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                )}

                {project.results ? (
                  <div className="border-t border-black/10 pt-6">
                    <p className="mb-2 font-mono text-caption uppercase tracking-[0.2em] text-brand-orange/80">
                      Impact
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {project.results}
                    </p>
                  </div>
                ) : null}
              </motion.div>
            </aside>

            <div className="min-w-0 space-y-14 md:space-y-16">
              {(project.problem || project.solution) && (
                <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                  <InsightCard
                    label="Défi"
                    title="Problématique"
                    accent="problem"
                  >
                    {project.problem ? <p>{project.problem}</p> : null}
                  </InsightCard>
                  <InsightCard
                    label="Réponse"
                    title="Solution"
                    accent="solution"
                  >
                    {project.solution ? <p>{project.solution}</p> : null}
                  </InsightCard>
                </div>
              )}

              <NarrativeBlock index={nextIndex()} title="Contexte">
                {project.context ? <p>{project.context}</p> : null}
              </NarrativeBlock>

              <NarrativeBlock index={nextIndex()} title="Description">
                {project.description ? <p>{project.description}</p> : null}
              </NarrativeBlock>

              {project.features && project.features.length > 0 ? (
                <motion.section {...fadeUp}>
                  <div className="mb-6 flex items-baseline gap-4">
                    <span
                      className="font-display text-4xl font-semibold text-brand-orange/25 md:text-5xl"
                      aria-hidden
                    >
                      {nextIndex()}
                    </span>
                    <h2 className="font-mono text-caption-sm uppercase tracking-[0.22em] text-neutral-600">
                      Fonctionnalités clés
                    </h2>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.features.map((feature, i) => (
                      <li
                        key={feature}
                        className={`flex gap-3 px-4 py-3.5 ${surfaceMuted}`}
                      >
                        <span className="mt-0.5 font-mono text-caption text-brand-orange/80">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm leading-relaxed text-neutral-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ) : null}
            </div>
          </div>
        </section>

        {gallery.length > 0 ? (
          <section className="project-gallery border-t border-black/10 bg-[#fff8ef]">
            <div className={`${PAGE_CONTAINER_CLASS} py-14 md:py-20`}>
              <motion.div {...fadeUp} className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-2 font-mono text-caption uppercase tracking-[0.2em] text-neutral-600">
                    Galerie
                  </p>
                  <h2 className="font-display text-2xl font-medium text-neutral-950 md:text-3xl">
                    Captures & visuels
                  </h2>
                </div>
                <span className="hidden font-mono text-caption text-neutral-500 md:block">
                  {String(gallery.length).padStart(2, '0')} images
                </span>
              </motion.div>
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-5">
                {gallery.map((src, i) => (
                  <motion.figure
                    key={`${src}-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: reduceMotion ? 0 : Math.min(i * 0.06, 0.36),
                      duration: reduceMotion ? 0 : 0.45,
                    }}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm lg:mb-5"
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(gallery, i, galleryAlts)}
                      className="group block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-inset"
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
        ) : null}

        <footer className={`${PAGE_CONTAINER_CLASS} border-t border-black/[0.08] py-12 md:py-16`}>
          <motion.div
            {...(reduceMotion ? {} : fadeUp)}
            className={`flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10 ${surfaceCard}`}
          >
            <div>
              <p className="font-mono text-caption uppercase tracking-[0.2em] text-neutral-600">
                Suite du parcours
              </p>
              <p className="mt-2 font-display text-xl text-neutral-950 md:text-2xl">
                {nextProject
                  ? `Suivant — ${nextProject.title}`
                  : 'Découvrir les autres projets'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {nextProject ? (
                <Link
                  to={getProjectPath(nextProject)}
                  className="site-button group inline-flex items-center gap-3 rounded-full border border-brand-orange bg-brand-orange px-6 py-3.5 font-mono text-caption uppercase tracking-wider text-white"
                >
                  Projet suivant
                  <ArrowLeft
                    size={16}
                    className="rotate-180 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              ) : null}
              <Link
                to="/#projets"
                className="site-button inline-flex items-center gap-3 rounded-full border border-black/20 px-6 py-3.5 font-mono text-caption uppercase tracking-wider text-neutral-800"
              >
                Voir le portfolio
              </Link>
            </div>
          </motion.div>
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
    </DetailShell>
  );
}
