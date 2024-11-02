// src/js/grid.js
import React from 'react';

// Сетка
export const Grid = ({ cellSize }) => {
    // Линии сетки
  const gridLines = [];

  for (let i = 0; i <= 1000; i += cellSize) {
    gridLines.push(
      <line key={`v-${i}`} className="grid-line" x1={i} y1={0} x2={i} y2={1000} />
    );
    gridLines.push(
      <line key={`h-${i}`} className="grid-line" x1={0} y1={i} x2={1000} y2={i} />
    );
  }

  return (
    <svg className="grid">
      <g>{gridLines}</g>
    </svg>
  );
};

export default Grid;