import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteShapeGridBackground } from "../SiteShapeGridBackground";
import { PAGE_CONTAINER_CLASS, PAGE_CONTAINER_NARROW_CLASS } from "../../layout";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-white/10 pt-8 first:border-0 first:pt-0">
      <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-white/45">
        {title}
      </h2>
      <div className="space-y-3 text-base leading-relaxed text-white/75 md:text-body-lg">
        {children}
      </div>
    </section>
  );
}

type LegalPageLayoutProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="relative min-h-screen text-white">
      <SiteShapeGridBackground />
      <div className="relative z-[1]">
      <header className="border-b border-white/10">
        <div className={`${PAGE_CONTAINER_NARROW_CLASS} flex items-center justify-between py-4 md:py-5`}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/50 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft size={16} aria-hidden />
            Accueil
          </Link>
        </div>
      </header>

      <article className={`${PAGE_CONTAINER_NARROW_CLASS} py-12 md:py-16 xl:py-20 2xl:py-24`}>
        <p className="font-mono text-caption uppercase tracking-widest text-white/40">
          Dernière mise à jour : {lastUpdated}
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-white md:text-4xl xl:text-5xl 2xl:text-display-md">
          {title}
        </h1>
        <div className="mt-10 space-y-0">{children}</div>
      </article>

      <footer className="border-t border-white/5 py-8">
        <div
          className={`${PAGE_CONTAINER_CLASS} max-w-3xl text-center font-mono text-caption uppercase tracking-widest text-white/35`}
        >
          <Link
            to="/"
            className="transition-colors hover:text-brand-orange"
          >
            Retour au portfolio
          </Link>
        </div>
      </footer>
      </div>
    </main>
  );
}
