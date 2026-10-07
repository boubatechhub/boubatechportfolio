/** Contraintes SEO / performance pour les images du portfolio. */
export const MAX_IMAGE_SIZE_BYTES = 300 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const IMAGE_UPLOAD_REQUIREMENTS_LABEL =
  "Moins de 300 Ko · RVB (JPEG, PNG ou WebP)";

export type ImageValidationResult =
  | { valid: true }
  | { valid: false; message: string };

function formatKo(bytes: number): string {
  return (bytes / 1024).toFixed(1).replace(".", ",");
}

function isAllowedMime(file: File): boolean {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);
}

/**
 * Vérifie qu'un fichier respecte les contraintes d'upload portfolio.
 */
export async function validatePortfolioImageFile(
  file: File,
): Promise<ImageValidationResult> {
  if (!isAllowedMime(file)) {
    return {
      valid: false,
      message:
        "Format non accepté. La photo doit être en RVB : JPEG, PNG ou WebP uniquement.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      message: `La taille de la photo doit être inférieure à 300 Ko (actuellement : ${formatKo(file.size)} Ko).`,
    };
  }

  try {
    await createImageBitmap(file);
  } catch {
    return {
      valid: false,
      message:
        "Fichier image invalide ou corrompu. Réexportez la photo en RVB (JPEG, PNG ou WebP).",
    };
  }

  return { valid: true };
}
