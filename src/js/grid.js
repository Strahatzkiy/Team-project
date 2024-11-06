// src/js/grid.js
import React, { useEffect } from 'react';

// Сетка
export const Grid = ({ cellSize, windowSize }) => {
  // Изменение размеров окна
  // Линии сетки
  const gridLines = [];

  for (let i = 0; i <= windowSize.width; i += cellSize) {
    gridLines.push(
      <line key={`v-${i}`} className="grid-line" x1={i} y1={0} x2={i} y2={windowSize.height} />
    );
    gridLines.push(
      <line key={`h-${i}`} className="grid-line" x1={0} y1={i} x2={windowSize.width} y2={i} />
    );
  }

  return (
    <svg id="grid-diagram-ignore" className="grid-diagram" width={windowSize.width} height={windowSize.height*0.8}>
      <g stroke="black" strokeWidth={1} opacity="10%">{gridLines}</g>
    </svg>
  );
};

export default Grid;