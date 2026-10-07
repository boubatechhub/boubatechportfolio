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
  "rounded-2xl border border-white/35 bg-white/[0.06] backdrop-blur-sm";

const navSurfaceClass = "border-white/35 bg-white/[0.06] backdrop-blur-sm";

type NavLinksGroupProps = {
  items: NavItem[];
  variant?: "desktop" | "mobile";
};

function NavLinksGroup({ items, variant = "desktop" }: NavLinksGroupProps) {
  if (variant === "mobile") {
    return (
      <div
        className={`mx-4 mb-4 flex w-[calc(100%-2rem)] items-stretch justify-between gap-0.5 p-1.5 shadow-2xl shadow-black ${navGroupClass}`}
        role="navigation"
        aria-label="Navigation principale"
      >
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <item.icon size={20} aria-hidden />
            <span className="truncate font-mono text-2xs font-bold uppercase tracking-tighter">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <nav
      className={`flex flex-wrap items-center justify-center divide-x divide-white/15 px-1 py-1.5 ${navGroupClass}`}
      aria-label="Navigation principale"
    >
      {items.map((item) => (
        <motion.a
          key={item.label}
          href={item.href}
          whileHover={{ y: -1 }}
          className="rounded-none px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white first:rounded-l-xl last:rounded-r-xl"
        >
          {item.label}
        </motion.a>
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
    <div className="h-full w-full" />
  );

  const cvButtonClass =
    "flex h-auto items-center gap-2 border-white/35 bg-white/[0.06] px-4 py-1.5 text-[10px] backdrop-blur-sm hover:border-white/55 hover:bg-white/[0.09]";

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 hidden w-full transition-all duration-500 md:block ${
          isScrolled
            ? `glass border-b py-4 xl:py-5 ${navSurfaceClass}`
            : "bg-transparent py-6 xl:py-8"
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
                className={`h-12 w-12 overflow-hidden rounded-2xl border ${navSurfaceClass}`}
              >
                {logoImage}
              </div>
              <span className="sr-only">{settings.name}</span>
            </div>
          </motion.div>

          <NavLinksGroup items={NAV_ITEMS} variant="desktop" />

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
            <Download size={14} />
            <span>CV</span>
          </Button>
        </div>
      </header>

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 md:hidden ${
          isScrolled
            ? `glass border-b py-3 ${navSurfaceClass}`
            : "bg-transparent py-4"
        }`}
      >
        <div
          className={`${PAGE_CONTAINER_CLASS} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 overflow-hidden rounded-2xl border ${navSurfaceClass}`}
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
        <NavLinksGroup items={NAV_ITEMS} variant="mobile" />
      </nav>
    </>
  );
}
