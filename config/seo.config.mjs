/** Config SEO partagée (scripts build + référence documentation). */
export const SITE_URL = 'https://boubacartraore.fr';

export const PERSON = {
  name: 'Boubacar Traoré',
  jobTitle: 'Développeur Web / Mobile & UI/UX Designer',
  email: 'boubacartraore8307@gmail.com',
  image: `${SITE_URL}/og.svg`,
  sameAs: ['https://www.linkedin.com/in/boubacartraoree'],
};

export const HOME = {
  title: 'Boubacar Traoré — Développeur Web / Mobile & UI/UX',
  description:
    'Portfolio de Boubacar Traoré : développeur web et mobile, designer UI/UX. Projets, expériences, compétences et contact.',
  tagline:
    'Concevoir, développer et optimiser des produits web rapides et immersifs.',
  bioShort:
    "Développeur web / mobile et designer UI/UX. Je conçois des interfaces pertinentes et des applications performantes, de la maquette au déploiement.",
};

export const PROJECTS_PAGE = {
  title: 'Tous les projets — Boubacar Traoré',
  description:
    'Découvrez l’ensemble des projets web et mobile de Boubacar Traoré : applications, plateformes et études de cas.',
};

export const OG_IMAGE = `${SITE_URL}/og.svg`;

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    url: SITE_URL,
    image: PERSON.image,
    email: PERSON.email,
    sameAs: PERSON.sameAs,
  };
}

export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
