import type { ChangeEvent } from "react";
import { validatePortfolioImageFile } from "../utils/imageUploadValidation";

type UseValidatedImageUploadOptions = {
  onValidFile: (file: File) => void | Promise<void>;
  onError: (message: string) => void;
};

/**
 * Valide taille et format RVB avant d'appeler l'upload Supabase.
 */
export function useValidatedImageUpload({
  onValidFile,
  onError,
}: UseValidatedImageUploadOptions) {
  return async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    const result = await validatePortfolioImageFile(file);
    if (result.valid === false) {
      onError(result.message);
      input.value = "";
      return;
    }

    try {
      await onValidFile(file);
    } finally {
      input.value = "";
    }
  };
}
