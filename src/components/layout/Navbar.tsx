import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  Download,
  Home,
  MessageSquare,
  Monitor,
  User,
  type LucideIcon,
} from "lucide-react";
import { CV_URL } from "../../constants";
import { PAGE_CONTAINER_CLASS } from "../../layout";
import type { Settings } from "../../types";
import {
  getDirectDownloadUrl,
  getDirectImageUrl,
  getProfileImageSrc,
} from "../../utils";
import { Button } from "../UI";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Accueil", href: "#accueil", icon: Home },
  { label: "À propos", href: "#à-propos", icon: User },
  { label: "Projets", href: "#projets", icon: Briefcase },
  { label: "Créations", href: "#créations", icon: Monitor },
  { label: "Contact", href: "#contact", icon: MessageSquare },
];

const navGroupClass =
  "rounded-full border border-white/10 bg-[#fffefb]/75 shadow-[0_8px_30px_-18px_rgb(60_40_20/35%)] backdrop-blur-md";

const navSurfaceClass = "border-white/10 bg-[#fffefb]/75 backdrop-blur-md";

/** Section actuellement visible, pour marquer le lien actif. */
function useActiveSection(initial: string) {
  const [active, setActive] = useState(initial);
  useEffect(() => {
    // On observe toutes les sections : une section hors menu (ex. compétences)
    // désactive le lien précédent au lieu de le laisser actif.
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );
    if (els.length === 0 || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

type NavLinksGroupProps = {
  items: NavItem[];
  variant?: "desktop" | "mobile";
  active?: string;
};

function NavLinksGroup({
  items,
  variant = "desktop",
  active,
}: NavLinksGroupProps) {
  if (variant === "mobile") {
    return (
      <div
        className={`mx-4 mb-4 flex w-[calc(100%-2rem)] items-stretch justify-between gap-0.5 p-1.5 ${navGroupClass} !rounded-2xl`}
        role="navigation"
        aria-label="Navigation principale"
      >
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={active === item.href.slice(1) ? "true" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
              active === item.href.slice(1)
                ? "bg-[#1a1814] text-[#fffefb]"
                : "text-white/55 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <item.icon size={18} strokeWidth={1.75} aria-hidden />
            <span className="truncate text-[0.65rem] font-medium tracking-tight">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-0.5 p-1 ${navGroupClass}`}
      aria-label="Navigation principale"
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-current={active === item.href.slice(1) ? "true" : undefined}
          className={`rounded-full px-4 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 ${
            active === item.href.slice(1)
              ? "bg-[#1a1814] text-[#fffefb]"
              : "text-white/60 hover:bg-white/[0.05] hover:text-white"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

type NavbarProps = {
  settings: Settings;
};

export function Navbar({ settings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const logoSrc = getDirectImageUrl(settings.faviconUrl || "");
  const profileSrc = getProfileImageSrc(settings.profileImageUrl);
  const active = useActiveSection("accueil");
  const displayName =
    settings.name && settings.name !== "BT." ? settings.name : "Boubacar Traoré";
  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoImage = logoSrc ? (
    <img
      src={logoSrc}
      alt={`Logo du site — ${settings.name || "Boubacar Traoré"}`}
      className="h-full w-full object-contain p-2"
      onError={(e) => {
        if (profileSrc) (e.target as HTMLImageElement).src = profileSrc;
      }}
      referrerPolicy="no-referrer"
      loading="eager"
      decoding="async"
      width={48}
      height={48}
    />
  ) : profileSrc ? (
    <img
      src={profileSrc}
      alt={`Logo du site — ${settings.name || "Boubacar Traoré"}`}
      className="h-full w-full object-cover"
      referrerPolicy="no-referrer"
      loading="eager"
      decoding="async"
      width={48}
      height={48}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center font-display text-sm font-semibold tracking-tight text-white">
      {initials}
      <span className="text-brand-orange">.</span>
    </div>
  );

  const cvButtonClass =
    "flex h-auto items-center gap-2 border-white/10 bg-[#fffefb]/75 px-4 py-2 !text-sm backdrop-blur-md";

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 hidden w-full transition-all duration-500 md:block ${
          isScrolled
            ? "py-3 xl:py-4"
            : "bg-transparent py-6 xl:py-7"
        }`}
      >
        <div
          className={`${PAGE_CONTAINER_CLASS} flex items-center justify-between gap-4`}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 overflow-hidden rounded-[14px] border ${navSurfaceClass}`}
              >
                {logoImage}
              </div>
              <span className="sr-only">{settings.name}</span>
            </div>
          </motion.div>

          <NavLinksGroup items={NAV_ITEMS} variant="desktop" active={active} />

          <Button
            variant="outline"
            className={`shrink-0 ${cvButtonClass}`}
            onClick={() =>
              window.open(
                getDirectDownloadUrl(settings.cvUrl || CV_URL),
                "_blank",
              )
            }
          >
            <Download size={15} aria-hidden />
            <span>Télécharger le CV</span>
          </Button>
        </div>
      </header>

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 md:hidden ${
          isScrolled
            ? "py-2.5"
            : "bg-transparent py-4"
        }`}
      >
        <div
          className={`${PAGE_CONTAINER_CLASS} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 overflow-hidden rounded-[13px] border ${navSurfaceClass}`}
            >
              {logoImage}
            </div>
          </div>

          <Button
            variant="outline"
            className={cvButtonClass}
            onClick={() =>
              window.open(
                getDirectDownloadUrl(settings.cvUrl || CV_URL),
                "_blank",
              )
            }
          >
            <Download size={14} />
            <span>CV</span>
          </Button>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 z-50 w-full pb-safe md:hidden">
        <NavLinksGroup items={NAV_ITEMS} variant="mobile" active={active} />
      </nav>
    </>
  );
}
