/**
 * Converts a Google Drive share link to a direct image link.
 * @param url The Google Drive URL
 * @returns The direct image URL or the original URL if not a Drive link
 */
export const getDirectImageUrl = (url: string | undefined): string => {
  if (!url) return "";

  // Handle Google Drive links
  if (url.includes("drive.google.com")) {
    let fileId = "";

    // Extract ID from various Google Drive URL formats
    const patterns = [
      /\/file\/d\/([^/]+)/,
      /[?&]id=([^&]+)/,
      /\/d\/([^/]+)/,
      /\/open\?id=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (fileId) {
      // Use the lh3 endpoint for images as it's more reliable and bypasses virus scan warnings
      // For non-images, uc?export=view is still the standard
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return url;
};

export const normalizeStringArray = (
  value: unknown,
  opts?: { splitOn?: RegExp; maxItems?: number },
): string[] => {
  const splitOn = opts?.splitOn ?? /[,\n]/g;
  const maxItems = opts?.maxItems ?? 200;

  if (Array.isArray(value)) {
    return value
      .flatMap((v) => (typeof v === "string" ? [v] : []))
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    // Support JSON stringified arrays: '["React","Supabase"]'
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return normalizeStringArray(parsed, opts);
      } catch {
        // fallback to split
      }
    }

    return trimmed
      .split(splitOn)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }

  return [];
};

/**
 * Converts a Google Drive share link to a direct download link.
 * @param url The Google Drive URL
 * @returns The direct download URL or the original URL if not a Drive link
 */
export const getDirectDownloadUrl = (url: string | undefined): string => {
  if (!url) return "";

  if (url.includes("drive.google.com")) {
    let fileId = "";
    const patterns = [
      /\/file\/d\/([^/]+)/,
      /[?&]id=([^&]+)/,
      /\/d\/([^/]+)/,
      /\/open\?id=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  return url;
};

/** Ancienne image locale retirée — ignore les URLs obsolètes. */
const REMOVED_PROFILE_IMAGE = /bouba\.jpeg/i;

export function sanitizeProfileImageUrl(url?: string): string {
  const raw = url?.trim() ?? "";
  if (!raw || REMOVED_PROFILE_IMAGE.test(raw)) return "";
  return raw;
}

export function getProfileImageSrc(url?: string): string {
  return getDirectImageUrl(sanitizeProfileImageUrl(url));
}

export type CodeRepoKind = "github" | "gitlab" | "bitbucket" | "custom";

export type CodeRepoMeta = {
  kind: CodeRepoKind;
  /** Libellé affiché (GitHub, GitLab, Code, etc.) */
  label: string;
  /** Hôte lisible pour title/aria (ex. git.client.com) */
  host: string;
};

/**
 * Déduit le type de dépôt depuis une URL.
 * Utile quand certains projets sont sur GitHub et d'autres sur un Git privé / domaine client.
 */
export function getCodeRepoMeta(url?: string): CodeRepoMeta | null {
  const raw = url?.trim() ?? "";
  if (!raw) return null;

  try {
    const parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "github.com" || host.endsWith(".github.com")) {
      return { kind: "github", label: "GitHub", host };
    }
    if (host === "gitlab.com" || host.endsWith(".gitlab.com")) {
      return { kind: "gitlab", label: "GitLab", host };
    }
    if (host === "bitbucket.org" || host.endsWith(".bitbucket.org")) {
      return { kind: "bitbucket", label: "Bitbucket", host };
    }

    return { kind: "custom", label: "Code", host };
  } catch {
    return { kind: "custom", label: "Code", host: "" };
  }
}
