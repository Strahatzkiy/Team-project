import "../css/shapes.css"
import { useEffect, useState, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

// Прямоугольник
export const Rectangle = ({width, height}) => {
    // Сохраняем объект в ref
    const ref = useRef(null);
    // Состояние переноса прямоугольника
    const [isDragging, setIsDragging] = useState(false);
  
    // Эффект при переносе прямоугольника
    useEffect(() => {
      const rectE1 = ref.current;
      invariant(rectE1);
  
      return draggable({
        element: rectE1,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      });
    });
  
    return (
      <div
        ref={ref}
        id={"shape"}
        className={`rectangle ${isDragging ? "dragging" : ""}`} 
        style={{
        width: `${width}px`,
        height: `${height}px`}
        }
      />
    );
  }
  
// Овал
export const Oval = () => {
  // Сохраняем объект в ref
    const ref = useRef(null);
    // Состояние переноса овала
    const [isDragging, setIsDragging] = useState(false);
  
    // Эффект при переносе овала
    useEffect(() => {
      const ovalE1 = ref.current;
      invariant(ovalE1);
  
      return draggable({
        element: ovalE1,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      });
    });
  
    return (
      <div
        ref={ref}
        id={"shape"}
        className={`oval ${isDragging ? "dragging" : ""}`}
      />
    )
}

// Стрелка
export const Arrow = ({x1, y1, x2, y2}) => {
  // Сохраняем объект в ref
    const ref = useRef(null);
    // Состояние переноса стрелки
    const [isDragging, setIsDragging] = useState(false);

    // Эффект при переносе стрелки
    useEffect(() => {
      const arrowE1 = ref.current;
      invariant(arrowE1);
  
      return draggable({
        element: arrowE1,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      });
    });

    return (
      <svg width={Math.abs(x2-x1)+20} height={Math.abs(y2-y1)+20} style={{position: "absolute", x: 0, y: 0}}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
        <line ref={ref}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          markerEnd="url(#arrow)"
          className={`arrow${isDragging ? " dragging" : ""}`}
        />
      </svg>
    );
}