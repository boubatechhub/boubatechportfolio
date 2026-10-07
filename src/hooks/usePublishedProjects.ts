import { useEffect, useState } from 'react';
import { loadPublishedProjects } from '../services/projectsService';
import type { Project } from '../types';

export function usePublishedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await loadPublishedProjects();
        if (!cancelled) setProjects(list);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : 'Impossible de charger les projets.',
          );
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, error };
}
