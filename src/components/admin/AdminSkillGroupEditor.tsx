import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { uploadPortfolioFile } from "../../services/storage";
import { getDirectImageUrl } from "../../utils";
import {
  IMAGE_UPLOAD_REQUIREMENTS_LABEL,
  validatePortfolioImageFile,
} from "../../utils/imageUploadValidation";

export type SkillEntry = { name: string; icon: string };

const adminInput =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-orange";
const adminLabel =
  "mb-1.5 block font-mono text-caption uppercase tracking-wider text-white/45";

type AdminSkillGroupEditorProps = {
  entries: SkillEntry[];
  onChange: Dispatch<SetStateAction<SkillEntry[]>>;
  onError: (message: string) => void;
  onSuccess?: (message: string) => void;
};

export function AdminSkillGroupEditor({
  entries,
  onChange,
  onError,
  onSuccess,
}: AdminSkillGroupEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateEntry = (index: number, patch: Partial<SkillEntry>) => {
    onChange((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    );
  };

  const addEntry = () => {
    onChange((prev) => [...prev, { name: "", icon: "" }]);
  };

  const removeEntry = (index: number) => {
    onChange((prev) => {
      if (prev.length <= 1) return [{ name: "", icon: "" }];
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadIconAt = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const result = await validatePortfolioImageFile(file);
      if (result.valid === false) {
        onError(result.message);
        return;
      }

      const url = await uploadPortfolioFile(file);
      updateEntry(index, { icon: url });
      onSuccess?.("Icône téléchargée — pensez à enregistrer le groupe.");
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Erreur lors du téléchargement.";
      onError(msg);
    } finally {
      setUploadingIndex(null);
      input.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className={adminLabel}>Technologies du groupe</label>
        <button
          type="button"
          onClick={addEntry}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-caption uppercase tracking-wider text-white/60 transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
        >
          <Plus size={14} aria-hidden />
          Ajouter
        </button>
      </div>
      <p className="text-caption-sm leading-relaxed text-white/45">
        {IMAGE_UPLOAD_REQUIREMENTS_LABEL}
      </p>

      <ul className="max-h-[min(50vh,420px)] space-y-3 overflow-y-auto pr-1">
        {entries.map((entry, index) => (
          <li
            key={index}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="font-mono text-caption uppercase tracking-widest text-white/35">
                #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-red-400"
                aria-label={`Supprimer ${entry.name || "technologie"}`}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <label className={adminLabel}>Nom</label>
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateEntry(index, { name: e.target.value })}
                  placeholder="React, Figma, Postman…"
                  className={adminInput}
                />
              </div>
              <div className="flex items-end gap-2">
                {entry.icon ? (
                  <img
                    src={getDirectImageUrl(entry.icon)}
                    alt={`Icône ${entry.name || "technologie"}`}
                    className="h-11 w-11 shrink-0 rounded-lg border border-white/10 bg-white/5 object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-caption text-white/25">
                    ?
                  </div>
                )}
                <label className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10">
                  {uploadingIndex === index ? (
                    <Loader2
                      size={18}
                      className="animate-spin text-brand-orange"
                    />
                  ) : (
                    <Upload size={18} className="text-white/50" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingIndex !== null}
                    onChange={(e) => void uploadIconAt(index, e)}
                  />
                </label>
              </div>
            </div>

            <div className="mt-3">
              <label className={adminLabel}>URL de l&apos;icône</label>
              <input
                type="url"
                value={entry.icon}
                onChange={(e) => updateEntry(index, { icon: e.target.value })}
                placeholder="https://…"
                className={adminInput}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
