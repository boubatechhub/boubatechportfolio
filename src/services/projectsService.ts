import { PROJECTS } from '../constants';
import type { Project } from '../types';
import { normalizeStringArray } from '../utils';
import { isUuid, slugify } from '../utils/slug';
import { isSupabaseConfigured } from './supabase';
import {
  fetchAllRows,
  fetchRowById,
  fetchRowByJsonField,
} from './supabaseDb';

export function normalizeProject(raw: Project): Project {
  const title = raw.title?.trim() ?? '';
  const slug =
    (raw.slug && String(raw.slug).trim()) || (title ? slugify(title) : raw.id);

  return {
    ...raw,
    slug,
    stack: normalizeStringArray(raw.stack),
    images: normalizeStringArray(raw.images),
    features: normalizeStringArray(raw.features),
    isPublished: raw.isPublished !== false,
  };
}

export function getProjectPath(project: Project): string {
  return `/projets/${project.slug || project.id}`;
}

function isPublished(project: Project): boolean {
  return project.isPublished !== false;
}

export async function loadPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) {
    return PROJECTS.map(normalizeProject).filter(isPublished);
  }
  const rows = await fetchAllRows<Project>('projects');
  return rows.map(normalizeProject).filter(isPublished);
}

export async function loadProjectBySlugOrId(
  slugOrId: string,
): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    const match = PROJECTS.map(normalizeProject).find(
      (p) => p.slug === slugOrId || p.id === slugOrId,
    );
    return match && isPublished(match) ? match : null;
  }

  let row = await fetchRowByJsonField<Project>('projects', 'slug', slugOrId);
  if (!row && isUuid(slugOrId)) {
    row = await fetchRowById<Project>('projects', slugOrId);
  }
  if (!row) return null;
  const project = normalizeProject(row);
  return isPublished(project) ? project : null;
}
