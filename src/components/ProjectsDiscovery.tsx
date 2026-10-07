import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../types";
import { Badge } from "./UI";
import { getDirectImageUrl } from "../utils";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type ProjectsDiscoveryProps = {
  projects: Project[];
  onOpen: (project: Project) => void;
  layout?: "featured" | "grid";
};

function projectImageSrc(url?: string): string {
  const raw = getDirectImageUrl(url);
  if (!raw || raw.includes("picsum.photos") || raw.includes("giphy.com")) {
    return "";
  }
  return raw;
}

function previewSources(project: Project): string[] {
  const cover = projectImageSrc(project.imageUrl);
  const extras = (project.images || [])
    .map(projectImageSrc)
    .filter(Boolean)
    .filter((src) => src !== cover);
  return [cover, ...extras].filter(Boolean);
}

function ProjectPreview({
  project,
  active,
  className = "",
}: {
  project: Project;
  active: boolean;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const sources = useMemo(() => previewSources(project), [project]);
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setFrame(0);
    setFailed({});
  }, [project.id]);

  useEffect(() => {
    if (reduceMotion || !active || sources.length < 2) return;
    const id = window.setInterval(() => {
      setFrame((prev) => (prev + 1) % sources.length);
    }, 1100);
    return () => window.clearInterval(id);
  }, [active, reduceMotion, sources.length]);

  if (sources.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 font-mono text-caption uppercase tracking-widest text-neutral-500 ${className}`}
      >
        Aperçu
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className}`}>
      {sources.map((src, i) => {
        const visible = i === frame && !failed[i];
        return (
          <img
            key={`${project.id}-${src}-${i}`}
            src={src}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out ${
              visible ? "opacity-100" : "opacity-0"
            } ${active && !reduceMotion ? "scale-[1.04]" : "scale-100"}`}
            onError={() =>
              setFailed((prev) => ({ ...prev, [i]: true }))
            }
            referrerPolicy="no-referrer"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        );
      })}
      {sources.every((_, i) => failed[i]) ? (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-caption uppercase tracking-widest text-neutral-500">
          Aperçu
        </div>
      ) : null}
    </div>
  );
}

function StackRow({ stack, max = 3 }: { stack: string[]; max?: number }) {
  const items = stack.filter(Boolean);
  if (items.length === 0) return null;
  const visible = items.slice(0, max);
  const extra = items.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tech) => (
        <Badge
          key={tech}
          className="border-brand-orange/20 bg-brand-orange/5 px-2.5 py-0.5 text-2xs text-neutral-800"
        >
          {tech}
        </Badge>
      ))}
      {extra > 0 ? (
        <span className="self-center font-mono text-2xs text-neutral-600">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

function FeaturedProject({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const blurb =
    project.shortDescription?.trim() || project.description?.trim() || "";
  const ref = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="portfolio-card group overflow-hidden rounded-2xl border border-white/20 bg-white/[0.04] transition-colors duration-300 hover:border-white/35"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <button
          type="button"
          onClick={onOpen}
          className="relative aspect-[16/9] w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange lg:aspect-auto lg:min-h-[13.5rem] xl:min-h-[15rem]"
          aria-label={`Ouvrir ${project.title}`}
        >
          <ProjectPreview
            project={project}
            active={hover}
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />
          <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
            À la une · {ref}
          </span>
        </button>

        <div className="flex flex-col justify-center gap-3 border-t border-black/10 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-5 xl:border-t-0 xl:border-l xl:p-6">
          <div>
            <p className="mb-1.5 font-mono text-2xs uppercase tracking-[0.2em] text-brand-orange">
              {project.category || "Projet"}
            </p>
            <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-neutral-950 sm:text-xl">
              {project.title}
            </h3>
            {blurb ? (
              <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-neutral-700">
                {blurb}
              </p>
            ) : null}
          </div>

          <StackRow stack={project.stack || []} max={3} />

          <button
            type="button"
            onClick={onOpen}
            className="site-button inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-orange bg-brand-orange px-3.5 py-1.5 font-mono text-2xs uppercase tracking-[0.16em] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Voir l&apos;étude de cas
            <ArrowUpRight size={12} aria-hidden />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectTile({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const blurb =
    project.shortDescription?.trim() || project.description?.trim() || "";
  const ref = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: reduceMotion ? 0 : Math.min((index - 1) * 0.06, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="portfolio-card group flex h-full flex-col overflow-hidden rounded-xl border border-white/20 bg-white/[0.04] transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-white/40"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full w-full flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange"
        aria-label={`Ouvrir ${project.title}`}
      >
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
          <ProjectPreview
            project={project}
            active={hover}
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/45 px-1.5 py-0.5 font-mono text-2xs uppercase tracking-[0.16em] text-white/65 backdrop-blur-sm">
            {ref}
          </span>
          <span
            className={`absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full border border-white/20 bg-black/55 px-1.5 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-opacity duration-250 ${
              hover || reduceMotion
                ? "opacity-100"
                : "opacity-0 group-focus-within:opacity-100 md:opacity-0"
            }`}
          >
            Voir
            <ArrowUpRight size={10} aria-hidden />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <div>
            <p className="font-mono text-2xs uppercase tracking-[0.16em] text-neutral-600">
              {project.category || "Projet"}
            </p>
            <h3 className="mt-0.5 font-display text-sm font-semibold leading-snug text-neutral-950 transition-colors duration-250 group-hover:text-brand-orange sm:text-base">
              {project.title}
            </h3>
            {blurb ? (
              <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-neutral-700 sm:text-sm">
                {blurb}
              </p>
            ) : null}
          </div>

          <div className="mt-auto space-y-2 pt-0.5">
            <StackRow stack={project.stack || []} max={2} />
            <span className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.14em] text-neutral-600 transition-colors duration-250 group-hover:text-brand-orange">
              Étude de cas
              <ArrowUpRight size={11} aria-hidden />
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

export function ProjectsDiscovery({
  projects,
  onOpen,
  layout = "featured",
}: ProjectsDiscoveryProps) {
  if (projects.length === 0) {
    return (
      <p className="text-center font-mono text-sm text-white/40">
        Aucun projet publié pour le moment.
      </p>
    );
  }

  const featured = projects[0]!;
  const rest = projects.slice(1);

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project, i) => (
          <ProjectTile
            key={project.id}
            project={project}
            index={i}
            onOpen={() => onOpen(project)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <FeaturedProject
        project={featured}
        index={0}
        onOpen={() => onOpen(featured)}
      />

      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4">
          {rest.map((project, i) => (
            <ProjectTile
              key={project.id}
              project={project}
              index={i + 1}
              onOpen={() => onOpen(project)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
