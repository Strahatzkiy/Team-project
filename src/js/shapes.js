import "../css/shapes.css"
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import AutowidthInput from "react-autowidth-input";
import invariant from "tiny-invariant";

const RectangleContext = createContext();

export const RectangleProvider = ({ children }) => {
  const [rectangle, setRectangle] = useState(null);

  const handleHover = (rect) => {
    setRectangle(rect);
  };

  return (
    <RectangleContext.Provider value={{ rectangle, handleHover }}>
      {children}
    </RectangleContext.Provider>
  );
};


// Прямоугольник
export const Rectangle = ({ id, x, y, width, height, content, canDrag, canType, onTextChanged, onDoubleClick, onBlur, isBig }) => {
    const { handleHover } = useContext(RectangleContext);
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
            id={id}
            className={`rectangle ${isDragging ? "dragging" : ""}`} 
            style={{
                width: `${width}px`,
                height: `${height}px`,
                overflow: 'hidden', // Скрыть переполнение
                position: 'relative', // Для абсолютного позиционирования
            }}
            onDoubleClick={handleDoubleClick} 
            onMouseEnter={() => handleHover({ x, y, width, height })}
            onMouseLeave={() => handleHover(null)} 
        >
            {
                (isBig ? (isEditing && canType ?
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
                ) : (isEditing && canType ?
                  (<textarea 
                      defaultValue={text}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      autoFocus 
                      className="input-diagram small"
                      style={{
                          width: `${width}px`,
                          height: `${height}px`,
                          resize: "none", // Запрет изменения размера
                      }}
                  />) : 
                  (<span style={{
                      textAlign: "center",
                      fontSize: "16pt",
                      userSelect: "none",
                      whiteSpace: "pre-wrap", // Сохраняет переносы строк
                      overflowWrap: "break-word", // Переносит длинные слова
                      display: 'block', // Заставляет span вести себя как блок
                      maxHeight: `${height}px`, // Ограничивает высоту
                      overflow: 'hidden', // Скрывает переполнение
                  }}>{text}</span>))
                )
            }
        </div>
    );
  }

// =====================================================================================================================================

  export const RectangleWithArrows = ({id, x, y, width, height, content, canDrag, canType, onTextChanged, addArrow, addRectangle, isBig, childRectangle }) => {
    const ref = useRef(null);
    const [text, setText] = useState(content);
    const [showButtons, setShowButtons] = useState(true); // Состояние для управления видимостью кнопок
    const [isDragging, setIsDragging] = useState(false);

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

    const addRectangleToWorkspace = () => { 
      console.log(id);
        let rectangleId = parseInt(id.match(/\d+/)[0]) + 1;
        console.log(rectangleId);
        addRectangle(rectangleId);
    };

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
    setShowButtons(false); // Скрыть кнопки при двойном щелчке
  };
  
  const handleBlur = () => {
    setShowButtons(true); // Показать кнопки при уводе фокуса
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
      onTextChanged(text);
    }
    if (e.key === "Escape") {
      handleBlur();
    }
  }

    return (
      <div ref={ref}>
        <Rectangle
          id={id}
          x={x}
          y={y}
          width={width}
          height={height}
          content={content}
          canDrag={canDrag}
          canType={canType}
          onTextChanged={onTextChanged}
          isBig={isBig}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        {showButtons && isBig ? (
                <div>
                  <button className="top-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('up')}></button>
                  <button className="bottom-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('down')}></button>
                  <button className="left-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('left')}></button>
                  <button className="right-button diagram-ignore add-arrow" onClick={() => addArrowToWorkspace('right')}></button>
                </div> ) : (!childRectangle && !isBig ? (<div>
                  <button className="right-button-small diagram-ignore add-arrow" onClick={() => addRectangleToWorkspace('right')}></button>
            </div>) : <div />)
            }
        </div>
    );
}

// Стрелка
export const Arrow = ({id, x1, y1, x2, y2, canDrag, initialText, side, canType, onTextChanged, addArrow, deleteArrow}) => {
  const ref = useRef(null);
  const { rectangle } = useContext(RectangleContext);
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [startCoords, setStartCoords] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null); 

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

  const getRectangleParams = () => {
    console.log(rectangle);
    if (rectangle) {
      return [rectangle.x, rectangle.y, rectangle.width, rectangle.height];
    }
    return null;
  };

  const handleArrowClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    console.log(startX);
    console.log(startY);
    if (!startCoords) {
      setStartCoords({ x: startX, y: startY });
    }
    setCurrentCoords(null); 
    console.log(startCoords);
    console.log(currentCoords);

    const handleMouseMove = (event) => {
      setCurrentCoords({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      console.log(startCoords);
      console.log(currentCoords);
    };

    const handleMouseUp = () => {
      console.log(startCoords);
      console.log(currentCoords);
      const rectangleHovered = getRectangleParams();
      console.log(rectangle);
      if (currentCoords.x > rectangleHovered.x && currentCoords.x < rectangleHovered.x + rectangleHovered.width 
        && currentCoords.y > rectangleHovered.y && currentCoords.y < rectangleHovered.y + rectangleHovered.height) {
        addArrow(startCoords.x, startCoords.y, currentCoords.x, currentCoords.y);
      }
      setStartCoords(null);
      setCurrentCoords(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    if (startCoords) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  useEffect(() => {
    const handleMouseMoveEvent = (event) => {
      setCurrentCoords({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMoveEvent);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveEvent);
    };
  }, []);

  const handleRectangleClick = (rectangleX, rectangleY) => {
    if (startCoords) {
      addArrow(startCoords.x, startCoords.y, rectangleX, rectangleY); // Добавляем новую стрелку
      setStartCoords(null); // Сбросить начальные координаты
    }
  };

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
      setStartCoords(null);
      setCurrentCoords(null);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setStartCoords(null);
      setCurrentCoords(null);
    }
  }
  
  const handleBlur = (e) => {
    if (e.relatedTarget && e.relatedTarget.classList.contains('arrow-delete')) {
      return;
    }
    setIsEditing(false);
  }

  const controlPoint1 = { x: (x1 + x2) / 2, y: y1 };
  const controlPoint2 = { x: (x1 + x2) / 2, y: y2 };

  return (
    <div className="arrow-container" onDoubleClick={handleDoubleClick} onClick={handleArrowClick}>
      <svg width={Math.abs(x2-x1)+20} height={Math.abs(y2-y1)+20} style={{position: "absolute", x: 20, y: 20}}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
        <path ref={ref}
          id={id}
          d={`M ${x1} ${y1} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${x2} ${y2}`}
          markerEnd="url(#arrow)"
          className={`arrow${isDragging ? " dragging" : ""}`}
          fill="none"
          stroke="black"
          strokeWidth="2"
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
