import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ExperienceItem, TimelineItem } from "../components/Cards";
import { About } from "../components/About";
import { Contact } from "../components/Contact";
import { CreationsGallery } from "../components/CreationsGallery";
import { Hero } from "../components/Hero";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { ScrollProgress } from "../components/layout/ScrollProgress";
import { SiteShapeGridBackground } from "../components/SiteShapeGridBackground";
import { ProjectsDiscovery } from "../components/ProjectsDiscovery";
import { SkillsSection } from "../components/SkillsSection";
import { Section } from "../components/UI";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { usePublishedProjects } from "../hooks/usePublishedProjects";
import { getProjectPath } from "../services/projectsService";
import type { ContentWork } from "../types";

export function PortfolioPage() {
  const navigate = useNavigate();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = usePublishedProjects();
  const { contentWorks, experiences, education, skills, settings } =
    usePortfolioData();

  const allStacks = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      for (const s of p.stack || []) {
        const value = String(s || "").trim();
        if (value) set.add(value);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);
  const featuredProjects = useMemo(() => {
    const selected = projects.filter((project) => project.isFeatured);
    const selectedIds = new Set(selected.map((project) => project.id));
    const remaining = projects.filter((project) => !selectedIds.has(project.id));
    return [...selected, ...remaining].slice(0, 4);
  }, [projects]);

  return (
    <div className="relative min-w-0 overflow-x-clip selection:bg-brand-orange selection:text-white">
      <SiteShapeGridBackground />
      <div className="relative z-[1]">
        <ScrollProgress />
        <Navbar settings={settings} />

        <main className="portfolio-content min-w-0 pb-24 md:pb-0">
          <Hero settings={settings} stacks={allStacks} />

          <About settings={settings} />

          <Section id="projets" subtitle=" " title="Mes projets web & mobile">
            {projectsLoading ? (
              <div className="space-y-6">
                <div
                  className="aspect-[16/10] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                  aria-hidden
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[16/11] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            ) : projectsError ? (
              <p className="text-center text-sm text-red-400/90" role="alert">
                {projectsError}
              </p>
            ) : projects.length === 0 ? (
              <p className="text-center font-mono text-sm text-white/40">
                Aucun projet publié pour le moment.
              </p>
            ) : (
              <ProjectsDiscovery
                projects={featuredProjects}
                onOpen={(project) => navigate(getProjectPath(project))}
              />
            )}
            {!projectsLoading && !projectsError && projects.length > 0 ? (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/projets"
                  className="site-button group inline-flex min-h-12 items-center gap-2 rounded-full border border-brand-orange bg-brand-orange px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Voir tous les projets
                  <span className="text-white/75">({projects.length})</span>
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            ) : null}
          </Section>

          <Section
            id="créations"
            subtitle="UI/UX Gallery"
            title="Designs UI/UX"
          >
            <CreationsGallery
              works={contentWorks}
              onWorkSelect={(work: ContentWork) => navigate(`/uiux/${work.id}`)}
            />
          </Section>

          <Section
            id="expériences"
            subtitle="Professionnelles"
            title="Expériences"
          >
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 xl:gap-10 2xl:gap-12">
              {experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} index={i} />
              ))}
            </div>
          </Section>

          <SkillsSection groups={skills} />

          <Section id="formation" subtitle="Parcours" title="Parcours">
            <div className="w-full">
              {education.map((edu, i) => (
                <TimelineItem key={edu.id} education={edu} index={i} />
              ))}
            </div>
          </Section>

          <Contact settings={settings} />
        </main>

        <Footer settings={settings} />
      </div>
    </div>
  );
}
