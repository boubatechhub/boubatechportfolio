/** Métadonnées SEO par page (title + description uniques). */
export const SEO_SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://boubacartraore.fr";

export const SEO_PERSON = {
  name: "Boubacar Traoré",
  jobTitle: "Développeur Web / Mobile & UI/UX Designer",
  email: "boubacartraore8307@gmail.com",
  linkedIn: "https://www.linkedin.com/in/boubacartraoree",
} as const;

export const SEO = {
  home: {
    title: "Boubacar Traoré — Développeur Web / Mobile & UI/UX",
    description:
      "Portfolio de Boubacar Traoré : développeur web et mobile, designer UI/UX. Projets, expériences, compétences et contact.",
    tagline:
      "Concevoir, développer et optimiser des produits web rapides et immersifs.",
    bioShort:
      "Développeur web / mobile et designer UI/UX. Je conçois des interfaces pertinentes et des applications performantes, de la maquette au déploiement.",
  },
  admin: {
    title: "Administration — Boubacar Traoré",
    description:
      "Espace d'administration du site : gestion des projets, créations de contenu, messages et paramètres du profil.",
  },
  adminLogin: {
    title: "Connexion administration — Boubacar Traoré",
    description:
      "Accès sécurisé à l'espace d'administration pour gérer les projets et le contenu du site.",
  },
  projectNotFound: {
    title: "Projet introuvable — Boubacar Traoré",
    description:
      "Ce projet n'existe pas ou n'est plus publié. Retournez à la liste des projets web et mobile.",
  },
  projects: {
    title: "Tous les projets — Boubacar Traoré",
    description:
      "Découvrez l'ensemble des projets web et mobile de Boubacar Traoré : applications, plateformes et études de cas.",
  },
  privacy: {
    title: "Politique de confidentialité — Boubacar Traoré",
    description:
      "Informations sur la collecte, l'utilisation et la protection de vos données personnelles sur le portfolio de Boubacar Traoré.",
  },
} as const;

export const SEO_OG_IMAGE = "/og.svg";

export const SEO_SITE_NAME = "Boubacar Traoré";

export function seoAbsoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SEO_SITE_URL}${normalized}`;
}

export function seoAbsoluteAsset(path: string): string {
  if (!path) return seoAbsoluteUrl(SEO_OG_IMAGE);
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return seoAbsoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SEO_PERSON.name,
    jobTitle: SEO_PERSON.jobTitle,
    url: SEO_SITE_URL,
    image: seoAbsoluteAsset(SEO_OG_IMAGE),
    email: SEO_PERSON.email,
    sameAs: [SEO_PERSON.linkedIn],
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: seoAbsoluteUrl(item.path),
    })),
  };
}
