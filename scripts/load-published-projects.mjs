import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Projets seed si Supabase indisponible au build. */
const FALLBACK_PROJECTS = [
  {
    slug: 'ikaso-reservation-hebergement',
    title: 'Ikaso - Réservation d’Hébergement',
    description:
      'Application de réservation d’hébergements intégrant un système client, hôte et dashboard.',
    category: 'Mobile App',
    isPublished: true,
  },
  {
    slug: 'gest-event-gestion-evenements',
    title: 'Gest Event - Gestion d’Événements',
    description:
      'Plateforme pour la réservation, le suivi des événements et la gestion des utilisateurs.',
    category: 'Web Platform',
    isPublished: true,
  },
];

function normalizeProject(raw) {
  const title = String(raw.title || '').trim();
  const slug =
    String(raw.slug || '').trim() ||
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') ||
    String(raw.id || '');

  return {
    slug,
    title,
    description: String(raw.description || '').trim(),
    category: String(raw.category || '').trim(),
    isPublished: raw.isPublished !== false,
  };
}

async function fromSupabase() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('projects').select('id, data');
  if (error) {
    console.warn('[seo] Supabase projects fetch failed:', error.message);
    return null;
  }

  return (data ?? [])
    .map((row) => normalizeProject({ id: row.id, ...row.data }))
    .filter((p) => p.isPublished && p.slug);
}

function fromConstantsFile() {
  try {
    const src = readFileSync(join(root, 'src/constants.ts'), 'utf8');
    const blocks = [...src.matchAll(/slug:\s*"([^"]+)"[\s\S]*?isPublished:\s*true/g)];
    if (blocks.length === 0) return FALLBACK_PROJECTS;

    return blocks.map((m) => {
      const slug = m[1];
      const fb = FALLBACK_PROJECTS.find((p) => p.slug === slug);
      return fb || { slug, title: slug, description: '', category: '', isPublished: true };
    });
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function loadPublishedProjectsForBuild() {
  const remote = await fromSupabase();
  if (remote?.length) {
    console.log(`[seo] ${remote.length} projet(s) chargé(s) depuis Supabase.`);
    return remote;
  }
  const local = fromConstantsFile();
  console.log(`[seo] ${local.length} projet(s) depuis constants (fallback).`);
  return local;
}
