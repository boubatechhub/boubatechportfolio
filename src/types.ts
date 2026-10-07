export interface Project {
  id: string;
  slug?: string;
  title: string;
  category: string;
  description: string;
  shortDescription?: string;
  context?: string;
  problem: string;
  solution: string;
  stack: string[];
  results?: string;
  imageUrl: string;
  images?: string[];
  features?: string[];
  role?: string;
  period?: string;
  link?: string;
  /** URL du dépôt (GitHub, GitLab, Bitbucket ou Git / domaine custom). */
  githubUrl?: string;
  figmaUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface Settings {
  id?: string;
  name: string;
  profileImageUrl: string;
  bio?: string;
  faviconUrl?: string;
  cvUrl?: string;
}

export type PreviewItem = {
  title: string;
  imageUrl: string;
  category: string;
  description?: string;
};

export interface Education {
  id: string;
  title: string;
  institution: string;
  period: string;
  skills: string[];
  technologies: string[];
  methodologies: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  link?: string;
}

export interface ContentWork {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  link?: string;
  figmaUrl?: string;
  images?: string[];
}

export interface SkillGroup {
  title: string;
  description?: string;
  link?: string;
  skills: { name: string; icon?: string }[];
}
