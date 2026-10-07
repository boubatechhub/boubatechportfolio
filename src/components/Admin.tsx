import React, { useState, useEffect } from "react";
import {
  fetchAllRows,
  fetchLatestSettings,
  insertRow,
  updateRowDataMerge,
  deleteRow,
  rowExistsByJsonField,
  type JsonTable,
} from "../services/supabaseDb";
import { isSupabaseConfigured } from "../services/supabase";
import {
  Project,
  ContentWork,
  Experience,
  Education,
  SkillGroup,
} from "../types";
import {
  AdminSkillGroupEditor,
  type SkillEntry,
} from "./admin/AdminSkillGroupEditor";
import {
  PROJECTS,
  CONTENT_WORKS,
  EXPERIENCES,
  EDUCATION,
  SKILLS,
  CV_URL,
} from "../constants";
import { SEO, SEO_OG_IMAGE } from "../constants/seo";
import { applySeo } from "../services/seo";
import { Button, Toast, FormModal } from "./UI";

const adminInput =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-orange";
const adminLabel =
  "mb-1.5 block font-mono text-caption uppercase tracking-wider text-white/45";
const adminTextarea = `${adminInput} min-h-[88px] resize-y`;
import { getDirectImageUrl, getDirectDownloadUrl, normalizeStringArray } from "../utils";
import { normalizeProject } from "../services/projectsService";
import { slugify } from "../utils/slug";
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Save,
  Database,
  AlertCircle,
  Upload,
  Loader2,
  Link2,
  User,
  Globe,
  Image as ImageIcon,
  FileText,
  Star,
} from "lucide-react";
import { uploadPortfolioFile } from "../services/storage";
import { IMAGE_UPLOAD_REQUIREMENTS_LABEL } from "../utils/imageUploadValidation";
import { useValidatedImageUpload } from "../hooks/useValidatedImageUpload";
import { handleDatabaseError, OperationType } from "../services/errorHandling";

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<
    | "projects"
    | "content"
    | "messages"
    | "settings"
    | "experiences"
    | "education"
    | "skills"
  >("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contentWorks, setContentWorks] = useState<ContentWork[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skillGroups, setSkillGroups] = useState<(SkillGroup & { id: string })[]>(
    [],
  );
  const [skillEntries, setSkillEntries] = useState<SkillEntry[]>([
    { name: "", icon: "" },
  ]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    name: "BT.",
    profileImageUrl: "",
    bio: "",
    faviconUrl: "",
    cvUrl: CV_URL,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type, visible: true });
  };

  const closeEditor = () => {
    setEditingItem(null);
    setImageUrl("");
    setPreviewUrl("");
    setSkillEntries([{ name: "", icon: "" }]);
  };

  const openNewItem = () => {
    setEditingItem({});
    if (activeTab === "skills") {
      setSkillEntries([{ name: "", icon: "" }]);
      return;
    }
    setImageUrl("");
    setPreviewUrl("");
  };

  const openEditItem = (item: {
    id?: string;
    imageUrl?: string;
    skills?: SkillGroup["skills"];
  }) => {
    setEditingItem(item);
    if (activeTab === "skills") {
      setSkillEntries(
        Array.isArray(item.skills) && item.skills.length > 0
          ? item.skills.map((s) => ({
              name: s.name ?? "",
              icon: s.icon ?? "",
            }))
          : [{ name: "", icon: "" }],
      );
      return;
    }
    setImageUrl(item.imageUrl || "");
    setPreviewUrl(item.imageUrl || "");
  };

  const formModalOpen =
    !!editingItem && activeTab !== "messages" && activeTab !== "settings";

  useEffect(() => {
    applySeo({
      title: SEO.admin.title,
      description: SEO.admin.description,
      canonicalPath: "/admin",
      robots: "noindex, nofollow",
      ogType: "website",
      ogImage: SEO_OG_IMAGE,
      jsonLd: null,
    });
  }, []);

  useEffect(() => {
    setEditingItem(null);
    setImageUrl("");
    setPreviewUrl("");
    setSkillEntries([{ name: "", icon: "" }]);
  }, [activeTab]);

  useEffect(() => {
    if (settings.faviconUrl) {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = getDirectImageUrl(settings.faviconUrl);
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [settings.faviconUrl]);

  const fetchAll = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const pPath = "projects";
      try {
        const raw = await fetchAllRows<Project>("projects");
        setProjects(raw.map((p) => normalizeProject(p)));
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, pPath);
      }

      const cPath = "content_works";
      try {
        setContentWorks(await fetchAllRows<ContentWork>("content_works"));
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, cPath);
      }

      const mPath = "messages";
      try {
        const raw = await fetchAllRows<{
          id: string;
          name: string;
          email: string;
          message: string;
          createdAt: string;
          read: boolean;
        }>("messages");
        setMessages(
          raw.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          ),
        );
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, mPath);
      }

      const sPath = "settings";
      try {
        const row = await fetchLatestSettings();
        if (row) {
          setSettings({
            ...row,
            cvUrl: (row as { cvUrl?: string }).cvUrl || CV_URL,
          });
        }
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, sPath);
      }

      const getYear = (p: string) => {
        if (
          p.toLowerCase().includes("en cours") ||
          p.toLowerCase().includes("présent")
        )
          return 9999;
        const years = p.match(/\d{4}/g);
        return years ? Math.max(...years.map(Number)) : 0;
      };

      const expPath = "experiences";
      try {
        const data = await fetchAllRows<Experience>("experiences");
        data.sort((a, b) => getYear(b.period) - getYear(a.period));
        setExperiences(data);
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, expPath);
      }

      const eduPath = "education";
      try {
        const data = await fetchAllRows<Education>("education");
        data.sort((a, b) => getYear(b.period) - getYear(a.period));
        setEducation(data);
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, eduPath);
      }

      const skillsPath = "skills";
      try {
        setSkillGroups(await fetchAllRows<SkillGroup & { id: string }>("skills"));
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, skillsPath);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!isSupabaseConfigured) {
      showToast("Configurez Supabase dans .env", "error");
      return;
    }
    if (
      !window.confirm(
        "Voulez-vous importer TOUTES les données initiales (Projets, Créations, Expériences, Formations, Compétences) dans Supabase ?",
      )
    )
      return;

    setLoading(true);
    try {
      const collections: {
        name: JsonTable;
        data: readonly unknown[];
      }[] = [
        { name: "projects", data: PROJECTS },
        { name: "content_works", data: CONTENT_WORKS },
        { name: "experiences", data: EXPERIENCES },
        { name: "education", data: EDUCATION },
        { name: "skills", data: SKILLS },
      ];

      for (const col of collections) {
        for (const item of col.data) {
          const { id: _id, ...data } = item as Record<string, unknown> & {
            id?: string;
          };

          const valueToMatch =
            (data.title as string) ||
            (data.name as string) ||
            (data.institution as string);
          const matchField = data.title
            ? "title"
            : data.name
              ? "name"
              : "institution";

          if (valueToMatch && matchField) {
            try {
              const exists = await rowExistsByJsonField(
                col.name,
                matchField,
                String(valueToMatch),
              );
              if (exists) continue;
            } catch (error) {
              await handleDatabaseError(error, OperationType.GET, col.name);
            }
          }

          try {
            await insertRow(col.name, data as Record<string, unknown>);
          } catch (error) {
            await handleDatabaseError(error, OperationType.CREATE, col.name);
          }
        }
      }

      alert(
        "Toutes les données fictives ont été enregistrées dans Supabase avec succès !",
      );
      showToast("Données importées avec succès");
      fetchAll();
    } catch (e) {
      console.error(e);
      showToast("Erreur lors de l'importation", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm("Supprimer cet élément ?")) {
      try {
        await deleteRow(type as JsonTable, id);
        void fetchAll();
      } catch (error) {
        await handleDatabaseError(error, OperationType.DELETE, type);
      }
    }
  };

  const handleFileUpload = useValidatedImageUpload({
    onError: (message) => showToast(message, "error"),
    onValidFile: async (file) => {
      setUploading(true);
      try {
        const publicUrl = await uploadPortfolioFile(file);
        setImageUrl(publicUrl);
        setPreviewUrl(publicUrl);
        showToast("Image téléchargée avec succès");
      } catch (error: unknown) {
        console.error("Upload error:", error);
        const msg =
          error instanceof Error ? error.message : "Erreur inconnue";
        showToast(`Erreur lors du téléchargement : ${msg}`, "error");
      } finally {
        setUploading(false);
      }
    },
  });

  const handleProfileUpload = useValidatedImageUpload({
    onError: (message) => showToast(message, "error"),
    onValidFile: async (file) => {
      setUploadingProfile(true);
      try {
        const url = await uploadPortfolioFile(file);
        setSettings({ ...settings, profileImageUrl: url });
        showToast("Photo de profil mise à jour");
      } catch (error: unknown) {
        console.error("Profile upload error:", error);
        const msg =
          error instanceof Error ? error.message : "Erreur inconnue";
        showToast(`Erreur lors du téléchargement : ${msg}`, "error");
      } finally {
        setUploadingProfile(false);
      }
    },
  });

  const handleFaviconUpload = useValidatedImageUpload({
    onError: (message) => showToast(message, "error"),
    onValidFile: async (file) => {
      setUploadingFavicon(true);
      try {
        const url = await uploadPortfolioFile(file);
        setSettings({ ...settings, faviconUrl: url });
        showToast("Favicon mis à jour");
      } catch (error: unknown) {
        console.error("Favicon upload error:", error);
        const msg =
          error instanceof Error ? error.message : "Erreur inconnue";
        showToast(`Erreur lors du téléchargement : ${msg}`, "error");
      } finally {
        setUploadingFavicon(false);
      }
    },
  });

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      showToast("Seuls les fichiers PDF sont acceptés pour le CV.", "error");
      e.target.value = "";
      return;
    }

    setUploadingCv(true);
    try {
      const url = await uploadPortfolioFile(file);
      setSettings({ ...settings, cvUrl: url });
      showToast("CV mis à jour");
    } catch (error: unknown) {
      console.error("CV upload error:", error);
      const msg = error instanceof Error ? error.message : "Erreur inconnue";
      showToast(`Erreur lors du téléchargement : ${msg}`, "error");
    } finally {
      setUploadingCv(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());

    // Handle stack, skills, technologies, methodologies as arrays
    if (data.stack)
      data.stack = data.stack.split(",").map((s: string) => s.trim());
    if (
      activeTab === "education" &&
      data.skills &&
      typeof data.skills === "string"
    )
      data.skills = data.skills.split(",").map((s: string) => s.trim());

    if (activeTab === "skills") {
      const payload = {
        title: String(data.title ?? "").trim(),
        description: String(data.description ?? "").trim(),
        skills: skillEntries
          .filter((e) => e.name.trim())
          .map((e) => ({
            name: e.name.trim(),
            ...(e.icon.trim() ? { icon: e.icon.trim() } : {}),
          })),
      };
      if (!payload.title) {
        showToast("Le titre du groupe est requis.", "error");
        setLoading(false);
        return;
      }
      if (payload.skills.length === 0) {
        showToast("Ajoutez au moins une technologie.", "error");
        setLoading(false);
        return;
      }
      const path = "skills";
      try {
        if (editingItem?.id) {
          await updateRowDataMerge("skills", editingItem.id, payload);
          showToast("Groupe de compétences modifié !");
        } else {
          await insertRow("skills", payload);
          showToast("Groupe de compétences ajouté !");
        }
        closeEditor();
        void fetchAll();
      } catch (error) {
        await handleDatabaseError(
          error,
          editingItem?.id ? OperationType.UPDATE : OperationType.CREATE,
          path,
        );
      } finally {
        setLoading(false);
      }
      return;
    }
    if (data.technologies && typeof data.technologies === "string")
      data.technologies = data.technologies
        .split(",")
        .map((s: string) => s.trim());
    if (data.methodologies && typeof data.methodologies === "string")
      data.methodologies = data.methodologies
        .split(",")
        .map((s: string) => s.trim());
    if (data.features && typeof data.features === "string")
      data.features = data.features
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    if (data.images && typeof data.images === "string") {
      data.images = data.images
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    if (activeTab === "projects") {
      const form = e.target as HTMLFormElement;
      const publishedCheckbox = form.querySelector<HTMLInputElement>(
        'input[name="isPublished"]',
      );
      const featuredCheckbox = form.querySelector<HTMLInputElement>(
        'input[name="isFeatured"]',
      );
      data.isPublished = publishedCheckbox?.checked ?? true;
      data.isFeatured = featuredCheckbox?.checked ?? false;
      const otherFeaturedCount = projects.filter(
        (project) =>
          project.id !== editingItem?.id && project.isFeatured === true,
      ).length;
      if (data.isFeatured && !editingItem?.isFeatured && otherFeaturedCount >= 4) {
        showToast("Vous pouvez sélectionner au maximum 4 projets à la une.", "error");
        setLoading(false);
        return;
      }
      if (!data.slug && data.title) data.slug = slugify(String(data.title));
      if (data.slug) data.slug = slugify(String(data.slug));
    }

    if (activeTab === "content") {
      // Ensure optional fields are normalized
      if (data.figmaUrl && typeof data.figmaUrl === "string") {
        data.figmaUrl = data.figmaUrl.trim();
      }
    }

    try {
      if (activeTab === "settings") {
        const path = "settings";
        const payload = {
          ...data,
          profileImageUrl: settings.profileImageUrl ?? "",
          faviconUrl: settings.faviconUrl ?? "",
          cvUrl: settings.cvUrl ?? "",
        };
        try {
          if (settings.id) {
            await updateRowDataMerge(
              "settings",
              settings.id,
              payload as Record<string, unknown>,
            );
          } else {
            await insertRow("settings", payload as Record<string, unknown>);
          }
          showToast("Paramètres mis à jour !");
        } catch (error) {
          await handleDatabaseError(error, OperationType.WRITE, path);
        }
      } else if (editingItem?.id) {
        const path =
          activeTab === "projects"
            ? "projects"
            : activeTab === "content"
              ? "content_works"
              : activeTab === "experiences"
                ? "experiences"
                : "education";
        try {
          await updateRowDataMerge(
            path as JsonTable,
            editingItem.id,
            data as Record<string, unknown>,
          );
          showToast("Modifié avec succès !");
        } catch (error) {
          await handleDatabaseError(error, OperationType.UPDATE, path);
        }
      } else {
        const path =
          activeTab === "projects"
            ? "projects"
            : activeTab === "content"
              ? "content_works"
              : activeTab === "experiences"
                ? "experiences"
                : "education";
        try {
          await insertRow(path as JsonTable, data as Record<string, unknown>);
          showToast("Ajouté avec succès !");
        } catch (error) {
          await handleDatabaseError(error, OperationType.CREATE, path);
        }
      }

      if (activeTab !== "settings") closeEditor();
      void fetchAll();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tabLabel =
    activeTab === "projects"
      ? "Projets"
      : activeTab === "content"
        ? "Créations"
        : activeTab === "experiences"
          ? "Expériences"
          : activeTab === "education"
            ? "Formations"
            : activeTab === "skills"
              ? "Compétences"
              : activeTab === "messages"
                ? "Messages"
                : "Paramètres";
  const featuredProjectCount = projects.filter(
    (project) => project.isFeatured === true,
  ).length;

  return (
    <div className="min-h-screen bg-bg-page text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-bg-page/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:py-5">
          <div>
            <p className="font-mono text-caption uppercase tracking-widest text-brand-orange">
              Administration
            </p>
            <h1 className="font-display text-xl font-medium sm:text-2xl">
              Tableau de bord d&apos;administration
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => window.open("/", "_blank")}
              className="!rounded-lg !px-3 !py-2 text-xs sm:!px-4"
            >
              <Globe size={16} /> Site
            </Button>
            <Button
              variant="outline"
              onClick={seedDatabase}
              className="!rounded-lg !px-3 !py-2 text-xs text-brand-orange sm:!px-4"
            >
              <Database size={16} /> Import
            </Button>
            <Button
              onClick={onLogout}
              className="!rounded-lg !px-3 !py-2 text-xs sm:!px-4"
            >
              <LogOut size={16} /> Sortir
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 no-scrollbar sm:px-6">
          {(
            [
              ["projects", "Projets"],
              ["content", "Créations"],
              ["experiences", "Expériences"],
              ["education", "Formations"],
              ["skills", "Compétences"],
              ["messages", "Messages"],
              ["settings", "Profil"],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
                activeTab === tab
                  ? "bg-brand-orange text-white"
                  : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
              {tab === "messages" &&
                messages.filter((m) => !m.read).length > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-2xs font-bold text-brand-orange">
                    {messages.filter((m) => !m.read).length}
                  </span>
                )}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {projects.length === 0 && contentWorks.length === 0 && !loading && (
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-brand-orange/25 bg-brand-orange/5 p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">
                Base de données vide détectée
              </h3>
              <p className="text-white/60 text-sm">
                Souhaitez-vous importer les données de démonstration pour
                commencer ?
              </p>
            </div>
            <Button
              onClick={seedDatabase}
              variant="secondary"
              className="!rounded-lg !px-4 !py-2 text-xs"
            >
              Importer
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg text-white/90 sm:text-xl">
              {tabLabel}
            </h2>
            {activeTab !== "messages" && activeTab !== "settings" && (
              <Button
                onClick={openNewItem}
                className="!rounded-lg !px-3 !py-2 text-xs sm:!px-4"
              >
                <Plus size={16} /> Ajouter
              </Button>
            )}
          </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : activeTab === "settings" ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
                <h2 className="mb-6 font-display text-xl sm:text-2xl">
                  Mon profil
                </h2>
                <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                        Nom d'affichage
                      </label>
                      <input
                        name="name"
                        defaultValue={settings.name}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-brand-orange outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                        Photo de profil
                      </label>
                      <p className="mb-2 text-caption-sm text-white/45">
                        Affichée dans la navigation et la section Contact.{" "}
                        {IMAGE_UPLOAD_REQUIREMENTS_LABEL}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/5">
                          {settings.profileImageUrl ? (
                            <img
                              src={getDirectImageUrl(settings.profileImageUrl)}
                              alt="Aperçu de la photo de profil"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <User size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="profileImageUrl"
                              value={settings.profileImageUrl}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  profileImageUrl: e.target.value,
                                })
                              }
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-orange outline-none transition-colors"
                              placeholder="URL de l'image"
                            />
                            <label
                              className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors`}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleProfileUpload}
                                disabled={uploadingProfile}
                              />
                              {uploadingProfile ? (
                                <Loader2
                                  size={18}
                                  className="animate-spin text-brand-orange"
                                />
                              ) : (
                                <Upload size={18} />
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                      Favicon du site
                    </label>
                    <p className="mb-2 text-caption-sm text-white/45">
                      {IMAGE_UPLOAD_REQUIREMENTS_LABEL}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                        {settings.faviconUrl ? (
                          <img
                            src={getDirectImageUrl(settings.faviconUrl)}
                            alt="Aperçu du favicon du site"
                            className="w-8 h-8 object-contain"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="faviconUrl"
                            value={settings.faviconUrl}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                faviconUrl: e.target.value,
                              })
                            }
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="URL du favicon"
                          />
                          <label
                            className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors`}
                          >
                            <input
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleFaviconUpload}
                              disabled={uploadingFavicon}
                            />
                            {uploadingFavicon ? (
                              <Loader2
                                size={18}
                                className="animate-spin text-brand-orange"
                              />
                            ) : (
                              <Upload size={18} />
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                      CV (téléchargement)
                    </label>
                    <p className="mb-2 text-caption-sm text-white/45">
                      Lien Google Drive ou fichier PDF (max. selon quota
                      Supabase).
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                        <FileText
                          size={22}
                          className={
                            settings.cvUrl ? "text-brand-orange" : "text-white/20"
                          }
                          aria-hidden
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="cvUrl"
                            value={settings.cvUrl ?? ""}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                cvUrl: e.target.value,
                              })
                            }
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="URL du CV (PDF ou Google Drive)"
                          />
                          <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                            <input
                              type="file"
                              className="hidden"
                              accept="application/pdf,.pdf"
                              onChange={handleCvUpload}
                              disabled={uploadingCv}
                            />
                            {uploadingCv ? (
                              <Loader2
                                size={18}
                                className="animate-spin text-brand-orange"
                              />
                            ) : (
                              <Upload size={18} />
                            )}
                          </label>
                        </div>
                        {settings.cvUrl ? (
                          <a
                            href={getDirectDownloadUrl(settings.cvUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-caption-sm text-brand-orange transition-colors hover:text-white"
                          >
                            <Link2 size={12} aria-hidden />
                            Prévisualiser le CV
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                      Bio courte
                    </label>
                    <textarea
                      name="bio"
                      defaultValue={settings.bio}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-brand-orange outline-none transition-colors h-32"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12"
                  >
                    {loading ? "Enregistrement..." : "Mettre à jour le profil"}
                  </Button>
                </form>
              </div>
            ) : activeTab === "messages" ? (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-white/40 text-center py-12 glass rounded-2xl">
                    Aucun message reçu pour le moment.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`glass p-6 rounded-xl border ${msg.read ? "border-white/5" : "border-brand-orange/30"} transition-all`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{msg.name}</h3>
                          <p className="text-sm text-brand-orange">
                            {msg.email}
                          </p>
                          <p className="text-caption text-white/40 uppercase font-mono mt-1">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!msg.read && (
                            <button
                              onClick={async () => {
                                const path = "messages";
                                try {
                                  await updateRowDataMerge(
                                    "messages",
                                    msg.id,
                                    { read: true },
                                  );
                                  void fetchAll();
                                } catch (error) {
                                  await handleDatabaseError(
                                    error,
                                    OperationType.UPDATE,
                                    path,
                                  );
                                }
                              }}
                              className="text-caption uppercase font-mono bg-brand-orange/20 text-brand-orange px-2 py-1 rounded hover:bg-brand-orange/30 transition-colors"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (window.confirm("Supprimer ce message ?")) {
                                const path = "messages";
                                try {
                                  await deleteRow("messages", msg.id);
                                  void fetchAll();
                                } catch (error) {
                                  await handleDatabaseError(
                                    error,
                                    OperationType.DELETE,
                                    path,
                                  );
                                }
                              }
                            }}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {(activeTab === "projects"
                  ? projects
                  : activeTab === "content"
                    ? contentWorks
                    : activeTab === "experiences"
                      ? experiences
                      : activeTab === "skills"
                        ? skillGroups
                        : education
                ).map((item: any) => (
                  <div
                    key={item.id}
                    className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-white/40">
                        {activeTab === "skills"
                          ? item.description ||
                            `${item.skills?.length ?? 0} technologie(s)`
                          : item.category || item.company || item.institution}
                      </p>
                      <p className="text-caption font-mono uppercase text-brand-orange">
                        {activeTab === "projects"
                          ? item.isPublished === false
                            ? "Brouillon"
                            : "Publié"
                          : activeTab === "skills"
                            ? `${item.skills?.length ?? 0} icônes`
                            : item.period}
                        {activeTab === "projects" && item.isFeatured ? (
                          <span className="ml-2 inline-flex items-center gap-1 text-amber-300">
                            <Star size={11} fill="currentColor" aria-hidden />
                            À la une
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => openEditItem(item)}
                        className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-brand-orange"
                        aria-label="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            item.id,
                            activeTab === "projects"
                              ? "projects"
                              : activeTab === "content"
                                ? "content_works"
                                : activeTab === "experiences"
                                  ? "experiences"
                                  : activeTab === "skills"
                                    ? "skills"
                                    : "education",
                          )
                        }
                        className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-red-400"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </main>

      <FormModal
        isOpen={formModalOpen}
        onClose={closeEditor}
        title={
          editingItem?.id
            ? `Modifier — ${tabLabel.replace(/s$/, "")}`
            : `Ajouter — ${tabLabel.replace(/s$/, "")}`
        }
      >
        {editingItem && (
          <form
            key={`${activeTab}-${editingItem.id ?? "new"}`}
            onSubmit={handleSave}
            className="space-y-4"
          >
                  {activeTab === "skills" ? (
                    <>
                      <div>
                        <label className={adminLabel}>
                          Titre du groupe
                        </label>
                        <input
                          name="title"
                          defaultValue={editingItem.title}
                          required
                          placeholder="Développement, Outils & Méthodes…"
                          className={adminInput}
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>Description</label>
                        <textarea
                          name="description"
                          defaultValue={editingItem.description}
                          className={adminTextarea}
                          placeholder="Courte description affichée sur le site"
                        />
                      </div>
                      <AdminSkillGroupEditor
                        entries={skillEntries}
                        onChange={setSkillEntries}
                        onError={(message) => showToast(message, "error")}
                        onSuccess={(message) => showToast(message)}
                      />
                    </>
                  ) : (
                    <>
                  <div>
                    <label className={adminLabel}>
                      Titre / Diplôme
                    </label>
                    <input
                      name="title"
                      defaultValue={editingItem.title}
                      required
                      className={adminInput}
                    />
                  </div>

                  {(activeTab === "projects" || activeTab === "content") && (
                    <div>
                      <label className={adminLabel}>
                        Catégorie
                      </label>
                      <input
                        name="category"
                        defaultValue={editingItem.category}
                        required
                        className={adminInput}
                      />
                    </div>
                  )}

                  {activeTab === "experiences" && (
                    <div>
                      <label className={adminLabel}>
                        Entreprise
                      </label>
                      <input
                        name="company"
                        defaultValue={editingItem.company}
                        required
                        className={adminInput}
                      />
                    </div>
                  )}

                  {activeTab === "education" && (
                    <div>
                      <label className={adminLabel}>
                        Institution
                      </label>
                      <input
                        name="institution"
                        defaultValue={editingItem.institution}
                        required
                        className={adminInput}
                      />
                    </div>
                  )}

                  {(activeTab === "experiences" ||
                    activeTab === "education") && (
                    <div>
                      <label className={adminLabel}>
                        Période (ex: 2024 - Présent)
                      </label>
                      <input
                        name="period"
                        defaultValue={editingItem.period}
                        required
                        className={adminInput}
                      />
                    </div>
                  )}

                  {(activeTab === "projects" || activeTab === "content") && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-mono text-white/40 uppercase">
                          Image (Firebase Storage)
                        </label>
                      </div>
                      <p className="mb-2 text-caption-sm leading-relaxed text-white/45">
                        {IMAGE_UPLOAD_REQUIREMENTS_LABEL}
                      </p>

                      <div className="flex items-center gap-3 mb-3">
                        <label
                          className={`flex-1 flex items-center justify-center gap-2 bg-white/5 border border-dashed border-white/20 rounded-lg px-4 py-3 transition-colors cursor-pointer hover:bg-white/10`}
                        >
                          {uploading ? (
                            <Loader2
                              size={18}
                              className="animate-spin text-brand-orange"
                            />
                          ) : (
                            <Upload size={18} className="text-white/40" />
                          )}
                          <span className="text-xs text-white/60">
                            {uploading
                              ? "Téléchargement..."
                              : "Choisir un fichier"}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <Link2 size={12} className="text-white/40" />
                        <label className="block text-xs font-mono text-white/40 uppercase">
                          Ou URL directe
                        </label>
                      </div>
                      <div className="space-y-3">
                        <input
                          name="imageUrl"
                          value={imageUrl}
                          required
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setPreviewUrl(e.target.value);
                          }}
                          className={adminInput}
                        />
                        {(previewUrl || editingItem.imageUrl) && (
                          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5">
                            <img
                              src={getDirectImageUrl(
                                previewUrl || editingItem.imageUrl,
                              )}
                              className="w-full h-full object-cover"
                              alt="Aperçu de l'image du projet"
                              onError={(e) => {
                                console.error(
                                  "Image load error for:",
                                  previewUrl || editingItem.imageUrl,
                                );
                                (e.target as HTMLImageElement).src =
                                  "https://picsum.photos/seed/error/1200/1600";
                              }}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={adminLabel}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors h-24"
                    />
                  </div>

                  {activeTab === "content" && (
                    <>
                      <div>
                        <label className={adminLabel}>Lien Figma (URL)</label>
                        <input
                          name="figmaUrl"
                          defaultValue={editingItem.figmaUrl}
                          className={adminInput}
                          placeholder="https://figma.com/..."
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Galerie d&apos;images (URLs, séparées par virgules)
                        </label>
                        <textarea
                          name="images"
                          defaultValue={normalizeStringArray(editingItem.images).join(", ")}
                          className="h-20 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs outline-none transition-colors focus:border-brand-orange"
                          placeholder="https://... , https://... , https://..."
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "education" && (
                    <>
                      <div>
                        <label className={adminLabel}>
                          Compétences (séparé par virgules)
                        </label>
                        <input
                          name="skills"
                          defaultValue={editingItem.skills?.join(", ")}
                          className={adminInput}
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Technologies (séparé par virgules)
                        </label>
                        <input
                          name="technologies"
                          defaultValue={editingItem.technologies?.join(", ")}
                          className={adminInput}
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Méthodologies (séparé par virgules)
                        </label>
                        <input
                          name="methodologies"
                          defaultValue={editingItem.methodologies?.join(", ")}
                          className={adminInput}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "projects" && (
                    <>
                      <div>
                        <label className={adminLabel}>
                          Slug (URL)
                        </label>
                        <input
                          name="slug"
                          defaultValue={editingItem.slug}
                          placeholder="mon-projet"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm outline-none transition-colors focus:border-brand-orange"
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Description courte
                        </label>
                        <textarea
                          name="shortDescription"
                          defaultValue={editingItem.shortDescription}
                          className="h-20 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition-colors focus:border-brand-orange"
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Contexte
                        </label>
                        <textarea
                          name="context"
                          defaultValue={editingItem.context}
                          className="h-24 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition-colors focus:border-brand-orange"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={adminLabel}>
                            Période
                          </label>
                          <input
                            name="period"
                            defaultValue={editingItem.period}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition-colors focus:border-brand-orange"
                          />
                        </div>
                        <div>
                          <label className={adminLabel}>
                            Mon rôle
                          </label>
                          <input
                            name="role"
                            defaultValue={editingItem.role}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition-colors focus:border-brand-orange"
                          />
                        </div>
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Galerie (URLs, virgules)
                        </label>
                        <textarea
                          name="images"
                          defaultValue={normalizeStringArray(editingItem.images).join(", ")}
                          className="h-20 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs outline-none transition-colors focus:border-brand-orange"
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Fonctionnalités (virgules)
                        </label>
                        <input
                          name="features"
                          defaultValue={normalizeStringArray(editingItem.features).join(", ")}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition-colors focus:border-brand-orange"
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Résultats
                        </label>
                        <textarea
                          name="results"
                          defaultValue={editingItem.results}
                          className="h-20 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition-colors focus:border-brand-orange"
                        />
                      </div>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                        <input
                          type="checkbox"
                          name="isPublished"
                          defaultChecked={editingItem.isPublished !== false}
                          className="h-4 w-4 accent-brand-orange"
                        />
                        <span className="text-sm text-white/80">
                          Publier sur le portfolio
                        </span>
                      </label>
                      <div>
                        <label
                          className={`flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 ${
                            featuredProjectCount >= 4 && !editingItem.isFeatured
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="isFeatured"
                            defaultChecked={editingItem.isFeatured === true}
                            disabled={
                              featuredProjectCount >= 4 && !editingItem.isFeatured
                            }
                            className="mt-0.5 h-4 w-4 accent-brand-orange"
                          />
                          <span className="text-sm text-white/80">
                            <span className="flex items-center gap-1.5">
                              <Star size={14} className="text-brand-orange" aria-hidden />
                              Mettre en avant dans l&apos;accueil
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-white/45">
                              Sélectionnez jusqu&apos;à 4 projets. Les places restantes sont
                              complétées automatiquement, jusqu&apos;à 4 projets affichés.
                            </span>
                          </span>
                        </label>
                        {featuredProjectCount >= 4 && !editingItem.isFeatured ? (
                          <p className="mt-1.5 text-xs text-brand-orange/90" role="status">
                            La sélection est complète. Retirez d&apos;abord un projet à la une.
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Stack (séparé par virgules)
                        </label>
                        <input
                          name="stack"
                        defaultValue={normalizeStringArray(editingItem.stack).join(", ")}
                          className={adminInput}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className={adminLabel}>
                            Lien du projet (Live)
                          </label>
                          <input
                            name="link"
                            defaultValue={editingItem.link}
                            className={adminInput}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className={adminLabel}>
                            Lien dépôt de code
                          </label>
                          <p className="mb-1.5 text-caption-sm text-white/40">
                            GitHub, GitLab, Bitbucket ou URL d’un Git privé /
                            domaine client.
                          </p>
                          <input
                            name="githubUrl"
                            defaultValue={editingItem.githubUrl}
                            className={adminInput}
                            placeholder="https://github.com/boubatechhub/... ou https://git.client.com/..."
                          />
                        </div>
                        <div>
                          <label className={adminLabel}>
                            Lien Figma
                          </label>
                          <input
                            name="figmaUrl"
                            defaultValue={editingItem.figmaUrl}
                            className={adminInput}
                            placeholder="https://figma.com/..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Problème
                        </label>
                        <textarea
                          name="problem"
                          defaultValue={editingItem.problem}
                          className={adminInput}
                        />
                      </div>
                      <div>
                        <label className={adminLabel}>
                          Solution
                        </label>
                        <textarea
                          name="solution"
                          defaultValue={editingItem.solution}
                          className={adminInput}
                        />
                      </div>
                    </>
                  )}
                    </>
                  )}

            <div className="sticky bottom-0 -mx-4 mt-2 border-t border-neutral-200 bg-[#fffdf9] pt-4 sm:-mx-6">
              <Button
                type="submit"
                disabled={loading}
                className="!w-full !rounded-lg !py-3"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <Save size={18} /> Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </FormModal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};
