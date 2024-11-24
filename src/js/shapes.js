import "../css/shapes.css"
import { useEffect, useState, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

// Прямоугольник
export const Rectangle = ({width, height, content, canDrag, canType, onTextChanged}) => {
    // Сохраняем объект в ref
    const ref = useRef(null);
    // Состояние переноса прямоугольника
    const [isDragging, setIsDragging] = useState(false);
    // Состояние для текста
    const [text, setText] = useState(content);
    // Состояние редактирования
    const [isEditing, setIsEditing] = useState(false);
  
    // Эффект при переносе прямоугольника
    useEffect(() => {
      const rectE1 = ref.current;
      invariant(rectE1);
      if (canDrag) {
        return draggable({
          element: rectE1,
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false),
        });
      }
    }, [canDrag]);

    const handleDoubleClick = () => {
      if (canType) {
        setIsEditing(true);
      }
    }

    const handleBlur = (e) => {
      const newText = e.target.value || "";
      setText(newText);
      onTextChanged(newText);
      setIsEditing(false);
    }

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        const newText = e.target.value || "";
        setText(newText);
        onTextChanged(newText);
        setIsEditing(false);
      }
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    }
  
    return (
      <div
        ref={ref}
        id={"shape"}
        className={`rectangle ${isDragging ? "dragging" : ""}`} 
        style={{
        width: `${width}px`,
        height: `${height}px`}
        }
        onDoubleClick={handleDoubleClick} 
      >
        {
        (isEditing && canType ? 
          (<input 
            type="text" 
            defaultValue={text}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus 
            className="input-diagram"
            style={{
              width: `${width}px`,
              height: `${height}px`,
             }}
            />
          ) : (<span style={{textAlign: "center", fontSize: "40pt", userSelect: "none",}}>{text}</span>))
          }
      </div>
    );
  }

  export const RectangleWithArrows = ({width, height, content, canDrag, canType, onTextChanged, addArrow, shapes}) => {
    const [text, setText] = useState(content);

    const addArrowToWorkspace = (direction) => {
      const centerX = width / 2;
      const centerY = height / 2;
      let arrow;

      switch (direction) {
          case 'up':
              arrow = { side: 'top' }; // Стрелка вверх
              break;
          case 'down':
              arrow = { side: 'bottom' }; // Стрелка вниз
              break;
          case 'left':
              arrow = { side: 'left' }; // Стрелка влево
              break;
          case 'right':
              arrow = { side: 'right' }; // Стрелка вправо
              break;
          default:
              return;
      }

      addArrow(arrow);
  };

    return (
      <div>
        <Rectangle
          width={width}
          height={height}
          content={content}
          canDrag={canDrag}
          canType={canType}
          onTextChanged={onTextChanged}
        />
        <div>
          <button className="top-button" onClick={() => addArrowToWorkspace('up')}></button>
          <button className="bottom-button" onClick={() => addArrowToWorkspace('down')}></button>
          <button className="left-button" onClick={() => addArrowToWorkspace('left')}></button>
          <button className="right-button" onClick={() => addArrowToWorkspace('right')}></button>
        </div>
      </div>
    );
}
  
// Овал
export const Oval = ({width, height, canDrag}) => {
  // Сохраняем объект в ref
    const ref = useRef(null);
    // Состояние переноса овала
    const [isDragging, setIsDragging] = useState(false);
  
    // Эффект при переносе овала
    useEffect(() => {
      const ovalE1 = ref.current;
      invariant(ovalE1);
      if (canDrag) {
        return draggable({
          element: ovalE1,
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false),
        });
      };
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
export const Arrow = ({x1, y1, x2, y2, canDrag}) => {
  // Сохраняем объект в ref
    const ref = useRef(null);
    // Состояние переноса стрелки
    const [isDragging, setIsDragging] = useState(false);

    // Эффект при переносе стрелки
    useEffect(() => {
      const arrowE1 = ref.current;
      invariant(arrowE1);
      if (canDrag) {
        return draggable({
          element: arrowE1,
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false),
        });
      }
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