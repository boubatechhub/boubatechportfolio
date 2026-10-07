import type { CSSProperties } from 'react';

export interface ShapeGridProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  shape?: 'square' | 'hexagon' | 'circle' | 'triangle';
  hoverTrailAmount?: number;
  useWindowPointer?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const ShapeGrid: (props: ShapeGridProps) => JSX.Element;
export default ShapeGrid;
