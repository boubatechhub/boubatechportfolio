/**
 * Fond global du site : lueur chaude diffuse + grain léger.
 * (Remplace l'ancienne grille animée, plus discrète et sans coût canvas.)
 */
export function SiteShapeGridBackground() {
  return (
    <>
      <div className="site-ambient" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
    </>
  );
}
