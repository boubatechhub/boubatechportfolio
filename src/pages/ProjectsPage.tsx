import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProjectsDiscovery } from "../components/ProjectsDiscovery";
import { SiteShapeGridBackground } from "../components/SiteShapeGridBackground";
import { Section } from "../components/UI";
import { usePublishedProjects } from "../hooks/usePublishedProjects";
import { getProjectPath } from "../services/projectsService";
import { applySeo } from "../services/seo";
import { SEO, SEO_OG_IMAGE } from "../constants/seo";
import { PAGE_CONTAINER_CLASS } from "../layout";

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, error } = usePublishedProjects();

  useEffect(() => {
    applySeo({
      title: SEO.projects.title,
      description: SEO.projects.description,
      canonicalPath: "/projets",
      robots: "index, follow",
      ogType: "website",
      ogImage: SEO_OG_IMAGE,
      jsonLd: null,
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white text-neutral-950">
      <SiteShapeGridBackground />
      <div className="relative z-[1]">
        <header className={`${PAGE_CONTAINER_CLASS} pt-8 md:pt-10`}>
          <Link
            to="/#projets"
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-neutral-700 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
              aria-hidden
            />
            Retour au portfolio
          </Link>
        </header>

        <main className="portfolio-content">
          <Section
            id="tous-les-projets"
            subtitle="Portfolio"
            title="Tous les projets"
            className="!mt-8 md:!mt-10"
          >
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
              Applications, plateformes et expériences conçues du concept à la
              réalisation.
            </p>

            {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-xl border border-orange-200 bg-orange-50"
                  aria-hidden
                />
              ))}
            </div>
            ) : error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
              {error}
            </p>
            ) : projects.length === 0 ? (
            <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-neutral-700">
              Aucun projet publié pour le moment.
            </p>
            ) : (
            <ProjectsDiscovery
              projects={projects}
              layout="grid"
              onOpen={(project) => navigate(getProjectPath(project))}
            />
            )}
          </Section>
        </main>
      </div>
    </div>
  );
}
