import {
  Project,
  Education,
  SkillGroup,
  Experience,
  ContentWork,
} from "./types";

export const CV_URL =
  "https://drive.google.com/file/d/1U1NqbDuQa56Bcvt4AWAxoiNGoRxLzqi3/view?usp=sharing";

/** Coordonnées affichées dans la section Contact (modifiables ici). */
export const CONTACT_DETAILS = {
  fullName: "Boubacar Traoré",
  role: "Développeur Web / Mobile & UI/UX Designer",
  location: "Gennevilliers, France",
  email: "boubacartraore8307@gmail.com",
  phone: "+33 6 31 11 01 71",
} as const;

export const CONTACT_SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/boubatechhub",
    handle: "@boubatechhub",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/boubacartraoree",
    handle: "boubacartraoree",
  },
  {
    label: "Site web",
    href: "https://boubacartraore.fr",
    handle: "boubacartraore.fr",
  },
] as const;

export const EXPERIENCES: Experience[] = [
  {
    id: "1",
    title: "Stagiaire Développeur Full Stack & Designer UI/UX",
    company: "Orange digital Center Mali",
    period: "3 Mois",
    description:
      "Contribution à l’élaboration du cahier des charges, création des maquettes complètes du site, de l’application web et mobile d’ECOTADJI.",
  },
  {
    id: "2",
    title: "Designer/Graphiste et CM",
    company: "KAMS CONSULTING",
    period: "3 Mois",
    description:
      "Création de contenus visuels et gestion des réseaux sociaux pour renforcer l’image et la visibilité digitale de l’entreprise et de ses clients.",
  },
];

export const CONTENT_WORKS: ContentWork[] = [
  {
    id: "c1",
    title: "Design System — composants UI",
    category: "UI/UX",
    imageUrl: "",
    description: "Composants, variantes, states et règles de composition.",
    figmaUrl: "",
    images: [],
  },
  {
    id: "c2",
    title: "Dashboard — UI kit",
    category: "UI/UX",
    imageUrl: "",
    description: "Grille, typographie, navigation et cards pour un dashboard.",
    figmaUrl: "",
    images: [],
  },
  {
    id: "c3",
    title: "App mobile — parcours utilisateur",
    category: "UI/UX",
    imageUrl: "",
    description: "Onboarding, écrans clés, micro-interactions et accessibilité.",
    figmaUrl: "",
    images: [],
  },
  {
    id: "c4",
    title: "Landing page — maquettes",
    category: "UI/UX",
    imageUrl: "",
    description: "Hero, sections, call-to-action et hiérarchie visuelle.",
    figmaUrl: "",
    images: [],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "ikaso-reservation-hebergement",
    isPublished: true,
    title: "Ikaso - Réservation d’Hébergement",
    category: "Mobile App",
    description:
      "Application de réservation d’hébergements intégrant un système client, hôte et dashboard.",
    problem:
      "Difficulté de centraliser les offres d'hébergement et de gérer les réservations en temps réel.",
    solution:
      "Utilisation de Flutter pour le front-end et Firebase pour le back-end et la base de données.",
    stack: ["Flutter", "Firebase", "Dart"],
    results: "Projet personnel réalisé en Octobre 2024.",
    imageUrl: "",
  },
  {
    id: "2",
    slug: "gest-event-gestion-evenements",
    isPublished: true,
    title: "Gest Event - Gestion d’Événements",
    category: "Web Platform",
    description:
      "Plateforme pour la réservation, le suivi des événements et la gestion des utilisateurs.",
    problem:
      "Manque d'outils intégrés pour la gestion fluide d'événements à Orange Digital Kalanso.",
    solution:
      "Architecture Angular (front-end), Spring Boot (back-end) et MySQL (base de données).",
    stack: ["Angular", "Spring Boot", "MySQL", "Java"],
    results: "Développé en Juin 2024 @ Orange Digital Kalanso.",
    imageUrl: "",
  },
];

export const EDUCATION: Education[] = [
  {
    id: "1",
    title: "Classe préparatoire Mastère",
    institution: "DIGITAL CAMPUS Paris",
    period: "En cours",
    skills: ["Stratégie Digitale", "Expertise Web"],
    technologies: ["Marketing Digital", "Management"],
    methodologies: ["Agile", "Stratégie"],
  },
  {
    id: "2",
    title: "BootCamp développement Full-stack",
    institution: "Orange Digital Center Bamako",
    period: "2024 (6 Mois)",
    skills: ["Développement Web", "Mobile", "Full Stack"],
    technologies: ["React Js", "Node.js", "Spring Boot"],
    methodologies: ["Git", "Agile"],
  },
  {
    id: "3",
    title: "DUT en Informatique de Gestion",
    institution: "INTEC-SUP Bamako-Mali",
    period: "2021 - 2022",
    skills: ["Informatique de Gestion", "Bases de données"],
    technologies: ["Java", "SQL", "PHP"],
    methodologies: ["UML", "Merise"],
  },
  {
    id: "4",
    title: "Baccalauréat en science Expérimentale",
    institution: "Lycée Kadidjah, Bamako-Mali",
    period: "2019 - 2020",
    skills: ["Sciences", "Mathématiques"],
    technologies: [],
    methodologies: [],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    title: "Développement",
    description:
      "Langages, frameworks et stacks pour concevoir des applications web et mobile.",
    skills: [
      {
        name: "HTML/CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "Angular",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
      },
      {
        name: "Flutter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      },
      {
        name: "React Js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Java/JEE",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
      {
        name: "Spring Boot",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
      },
    ],
  },
  {
    title: "Design & Audio-visuel",
    description:
      "Maquettes UI/UX, identité visuelle et production de contenus visuels.",
    skills: [
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Photoshop",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
      },
      {
        name: "Illustrator",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
      },
      {
        name: "Premiere Pro",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg",
      },
      {
        name: "After Effects",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg",
      },
      {
        name: "CapCut",
        icon: "https://images.seeklogo.com/logo-png/43/1/capcut-logo-png_seeklogo-437025.png",
      },
      {
        name: "Canva",
        icon: "https://www.vectorlogo.zone/logos/canva/canva-icon.svg",
      },
    ],
  },
  {
    title: "Outils & Méthodes",
    description:
      "Outils du quotidien pour livrer, déployer et collaborer sur vos projets.",
    skills: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      },
      {
        name: "IA Tools",
        icon: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
      },
      {
        name: "Supabase",
        icon: "https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg",
      },
      {
        name: "Firebase",
        icon: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
      },
      {
        name: "Postman",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
      },
      {
        name: "Make",
        icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@master/png/make.png",
      },
      {
        name: "Vercel",
        icon: "https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg",
      },
      {
        name: "Cursor",
        icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@master/png/cursor.png",
      },
      {
        name: "Agile",
        icon: "https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg",
      },
      {
        name: "Trello",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",
      },
    ],
  },
];
