import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SEO,
  SEO_OG_IMAGE,
  buildPersonJsonLd,
} from "../../constants/seo";
import { applySeo } from "../../services/seo";

/** SEO global pour l'accueil uniquement (détail projet et admin gèrent le leur). */
export function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.startsWith("/projets/") ||
      location.pathname === "/projets" ||
      location.pathname.startsWith("/uiux/") ||
      location.pathname.startsWith("/boubadev") ||
      location.pathname === "/confidentialite"
    ) {
      return;
    }

    applySeo({
      title: SEO.home.title,
      description: SEO.home.description,
      canonicalPath: "/",
      robots: "index, follow",
      ogType: "website",
      ogImage: SEO_OG_IMAGE,
      jsonLd: buildPersonJsonLd(),
    });
  }, [location.pathname]);

  return null;
}
