import { Link } from "react-router-dom";
import { PAGE_CONTAINER_CLASS } from "../../layout";
import { Stagger, StaggerItem } from "../Reveal";
import type { Settings } from "../../types";

type FooterProps = {
  settings: Settings;
};

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="mb-24 border-t border-white/5 py-10 md:mb-0 md:py-12 xl:py-14">
      <Stagger
        edge
        gap={0.1}
        className={`${PAGE_CONTAINER_CLASS} flex w-full flex-col items-center justify-between gap-6 sm:gap-8 md:flex-row md:gap-8`}
      >
        <StaggerItem className="font-display text-xl font-bold tracking-tighter xl:text-2xl">
          {settings.name.includes(".") ? (
            <>
              {settings.name.split(".")[0]}
              <span className="text-brand-orange">.</span>
            </>
          ) : (
            settings.name
          )}
        </StaggerItem>

        <StaggerItem>
          <p className="text-center font-mono text-caption uppercase tracking-widest text-white/40 md:text-xs">
            © 2026 — Conçu avec passion par {settings.name.replace(".", "")}
          </p>
        </StaggerItem>

        <StaggerItem className="flex items-center gap-6 md:gap-8">
          <Link
            to="/confidentialite"
            className="font-mono text-caption uppercase tracking-widest text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
          >
            Confidentialité
          </Link>
        </StaggerItem>
      </Stagger>
    </footer>
  );
}
