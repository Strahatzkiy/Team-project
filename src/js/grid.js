// src/js/grid.js
import React from 'react';

// Сетка
export const Grid = ({ cellSize }) => {
    // Линии сетки
  const gridLines = [];

  for (let i = 0; i <= window.outerWidth; i += cellSize) {
    gridLines.push(
      <line key={`v-${i}`} className="grid-line" x1={i} y1={0} x2={i} y2={window.outerHeight} />
    );
    gridLines.push(
      <line key={`h-${i}`} className="grid-line" x1={0} y1={i} x2={window.outerWidth} y2={i} />
    );
  }

  return (
    <svg className="grid" width={window.outerWidth * 0.88} height={window.outerHeight*0.7}>
      <g stroke="black" strokeWidth={1} opacity="10%">{gridLines}</g>
    </svg>
  );
};

export default Grid;