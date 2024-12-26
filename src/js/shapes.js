import "../css/shapes.css"
import { useEffect, useState, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import AutowidthInput from "react-autowidth-input";
import invariant from "tiny-invariant";

// Прямоугольник
export const Rectangle = ({ width, height, content, canDrag, canType, onTextChanged, onDoubleClick, onBlur }) => {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [text, setText] = useState(content);
    const [isEditing, setIsEditing] = useState(false);

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
        onDoubleClick(); 
    }

    const handleBlur = (e) => {
        const newText = e.target.value || "";
        setText(newText);
        onTextChanged(newText);
        setIsEditing(false);
        onBlur(); 
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
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
                height: `${height}px`,
                overflow: 'hidden', // Скрыть переполнение
                position: 'relative', // Для абсолютного позиционирования
            }}
            onDoubleClick={handleDoubleClick} 
        >
            {
                (isEditing && canType ? 
                    (<textarea 
                        defaultValue={text}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus 
                        className="input-diagram"
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                            resize: "none", // Запрет изменения размера
                        }}
                    />) : 
                    (<span style={{
                        textAlign: "center",
                        fontSize: "40pt",
                        userSelect: "none",
                        whiteSpace: "pre-wrap", // Сохраняет переносы строк
                        overflowWrap: "break-word", // Переносит длинные слова
                        display: 'block', // Заставляет span вести себя как блок
                        maxHeight: `${height}px`, // Ограничивает высоту
                        overflow: 'hidden', // Скрывает переполнение
                    }}>{text}</span>)
                )
            }
        </div>
    );
  }



  export const RectangleWithArrows = ({width, height, content, canDrag, canType, onTextChanged, addArrow, shapes}) => {
    const [text, setText] = useState(content);
    const [showArrows, setShowArrows] = useState(true); // Состояние для управления видимостью кнопок


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

  const handleDoubleClick = () => {
    setShowArrows(false); // Скрыть кнопки при двойном щелчке
  };
  
  const handleBlur = () => {
    setShowArrows(true); // Показать кнопки при уводе фокуса
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
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
        />
        <div>
        {showArrows && (
                <div>
                    <button className="top-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('up')}></button>
                    <button className="bottom-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('down')}></button>
                    <button className="left-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('left')}></button>
                    <button className="right-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('right')}></button>
                </div>
            )}

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
export const Arrow = ({id, x1, y1, x2, y2, canDrag, initialText, side, canType, onTextChanged, deleteArrow}) => {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

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

  const updateDiagram = () => {
    window.dispatchEvent(new Event('resize'));
  };

  const deleteArrowFromWorkspace = (e) => {
    setIsEditing(false);
    deleteArrow(id); // Убедитесь, что передаете правильный id
    setTimeout(() => 
    updateDiagram(), 10)
  }

  const handleDoubleClick = () => {
    if (canType) {
      setIsEditing(true);
    }
  }

  const handleChange = (e) => { 
    const newText = e.target.value;
    setText(newText);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onTextChanged(text); // Сохраняем текст при нажатии Enter
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  }
  
  const handleBlur = (e) => {
    if (e.relatedTarget && e.relatedTarget.classList.contains('arrow-delete')) {
      return;
    }
    setIsEditing(false);
  }


  return (
    <div className="arrow-container" onDoubleClick={handleDoubleClick}>
      <svg width={Math.abs(x2-x1)+20} height={Math.abs(y2-y1)+20} style={{position: "absolute", x: 20, y: 20}}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
        <line ref={ref}
          id={id}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          markerEnd="url(#arrow)"
          className={`arrow${isDragging ? " dragging" : ""}`}
        />
      </svg>
      {
        (isEditing && canType ? 
          (<div>
            <AutowidthInput 
              type="text" 
              value={text}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus 
              className={`arrow-input ${side}`}
              style={{textAlign: "left", fontSize: "14pt", userSelect: "none"}}
            />
            <button className={`arrow-delete ${side}`} onClick={deleteArrowFromWorkspace}>
              Удалить
            </button>
          </div>
          ) : (
          <span id={`arrow-span-${id}`} className={`arrow-span ${side}`} style={{userSelect: "none", }}>
            {text}
          </span>
        ))
      }
    </div>
  );
}
