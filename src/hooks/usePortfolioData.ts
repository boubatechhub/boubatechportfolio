import { useEffect, useState } from "react";
import {
  CONTENT_WORKS,
  CV_URL,
  EDUCATION,
  EXPERIENCES,
  SKILLS,
} from "../constants";
import { handleDatabaseError, OperationType } from "../services/errorHandling";
import { isSupabaseConfigured } from "../services/supabase";
import {
  fetchAllRows,
  fetchLatestSettings,
} from "../services/supabaseDb";
import type {
  ContentWork,
  Education,
  Experience,
  Settings,
  SkillGroup,
} from "../types";
import { getDirectImageUrl, sanitizeProfileImageUrl } from "../utils";
import { getLastYearFromPeriod } from "../utils/portfolio";

const DEFAULT_SETTINGS: Settings = {
  name: "BT.",
  profileImageUrl: "",
  bio: "",
  cvUrl: CV_URL,
};

export function usePortfolioData() {
  const [contentWorks, setContentWorks] =
    useState<ContentWork[]>(CONTENT_WORKS);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [education, setEducation] = useState<Education[]>(EDUCATION);
  const [skills, setSkills] = useState<SkillGroup[]>(SKILLS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        try {
          const rows = await fetchAllRows<ContentWork>("content_works");
          if (rows.length > 0) setContentWorks(rows);
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, "content_works");
        }

        try {
          const data = await fetchAllRows<Experience>("experiences");
          if (data.length > 0) {
            data.sort(
              (a, b) =>
                getLastYearFromPeriod(b.period) - getLastYearFromPeriod(a.period),
            );
            setExperiences(data);
          }
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, "experiences");
        }

        try {
          const data = await fetchAllRows<Education>("education");
          if (data.length > 0) {
            data.sort(
              (a, b) =>
                getLastYearFromPeriod(b.period) - getLastYearFromPeriod(a.period),
            );
            setEducation(data);
          }
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, "education");
        }

        try {
          const rows = await fetchAllRows<SkillGroup & { id: string }>("skills");
          if (rows.length > 0) setSkills(rows);
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, "skills");
        }

        try {
          const row = await fetchLatestSettings();
          if (row && typeof row.name === "string") {
            const loaded = row as unknown as Settings;
            setSettings({
              ...loaded,
              profileImageUrl: sanitizeProfileImageUrl(loaded.profileImageUrl),
              cvUrl: loaded.cvUrl || CV_URL,
            });
          }
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, "settings");
        }
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    if (!settings.faviconUrl) return;
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = getDirectImageUrl(settings.faviconUrl);
    document.head.appendChild(link);
  }, [settings.faviconUrl]);

  return {
    contentWorks,
    experiences,
    education,
    skills,
    settings,
    loading,
  };
}
