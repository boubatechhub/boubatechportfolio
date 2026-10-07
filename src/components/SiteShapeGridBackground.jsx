import ShapeGrid from "./ShapeGrid";
import "./ShapeGrid.css";

/** Fond carreaux unique pour toutes les pages hors hero. */
export function SiteShapeGridBackground() {
  return (
    <div className="site-shape-grid" aria-hidden="true">
      <ShapeGrid
        useWindowPointer
        speed={0.08}
        squareSize={40}
        direction="horizontal"
        borderColor="#d6d6d2"
        hoverFillColor="rgba(242, 125, 38, 0.22)"
        shape="square"
        hoverTrailAmount={12}
      />
    </div>
  );
}
