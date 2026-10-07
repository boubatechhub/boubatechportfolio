/** Active ou désactive le splash screen globalement. */
export const SPLASH_ENABLED = true;

/** Clé localStorage — une seule fois par navigateur. */
export const SPLASH_STORAGE_KEY = "portfolio_splash_seen";

/** @deprecated Plus utilisé pour une sortie auto — l’entrée se fait via « Click me ». */
export const SPLASH_DURATION_MS = 7900;

/** Délai avant le démarrage de la barre de progression (ms). */
export const SPLASH_PROGRESS_START_MS = 1800;

/** Durée de remplissage de la barre de progression (ms). */
export const SPLASH_PROGRESS_DURATION_MS = 4400;

export const SPLASH_PROGRESS_MESSAGES = [
  "Initialisation...",
  "Chargement des projets...",
  "Chargement des compétences...",
  "Préparation du portfolio...",
  "Bienvenue.",
] as const;

export const SPLASH_ROLES = [
  "Full Stack Developer",
  "Développeur IA",
  "Designer UI/UX",
] as const;

export const SPLASH_FOCUS_AREAS = [
  "Développement Full Stack",
  "Design UI/UX",
] as const;
