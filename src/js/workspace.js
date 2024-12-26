import { Rectangle, Oval, Arrow, RectangleWithArrows } from "./shapes.js";
import { Grid } from "./grid.js";
import { useState, useRef, useEffect } from "react";

// Контейнер рабочего пространства
export const WorkspaceContainer = () => {
  const [shapes, setShapes] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const workspaceRef = useRef(null);
  const cellSize = 10;
  let resizeTimeout;
  let delayTimeout;

  const arrowPosition = (params) => {
    const { side, offsetX, offsetY, rectangle } = params;
    switch (side) {
      case 'top':
        params.x += offsetX;
        params.y -= 120;
        params.y1 = 0;
        params.y2 = 100;
        break;
      case 'bottom':
        params.x += offsetX;
        params.y += rectangle.height;
        params.y1 = 120;
        params.y2 = 20;
        break;
      case 'left':
        params.x -= 220;
        params.y += offsetY;
        params.x1 = 0;
        params.x2 = 200;
        break;
      case 'right':
        params.x += rectangle.width;
        params.y += offsetY;
        params.x1 = 0;
        params.x2 = 200;
        break;
    }
    return (params);
  }

  let arrowIdCounter = localStorage.getItem('arrowIdCounter') ? 
                     parseInt(localStorage.getItem('arrowIdCounter')) : 0;

  const createArrow = (side, offsetX, offsetY, rectangle) => {
    let params = {
      x: rectangle.position.x,
      y: rectangle.position.y,
      x1: 10,
      y1: 10,
      x2: 10,
      y2: 10,
      side,
      offsetX,
      offsetY,
      rectangle
    };
    params = arrowPosition(params);
    // Округление значений
    params.x = Math.round(params.x / cellSize) * cellSize;
    params.y = Math.round(params.y / cellSize) * cellSize;
    params.x1 = Math.round(params.x1 / cellSize) * cellSize;
    params.y1 = Math.round(params.y1 / cellSize) * cellSize;
    params.x2 = Math.round(params.x2 / cellSize) * cellSize;
    params.y2 = Math.round(params.y2 / cellSize) * cellSize;
    const arrow = {
      id: `arrow-${arrowIdCounter++}`, // Используем счетчик
      type: "arrow",
      position: {
          x: params.x,
          y: params.y,
      },
      x1: params.x1,
      y1: params.y1,
      x2: params.x2,
      y2: params.y2,
      side: params.side,
      canDrag: false,
      canType: true,
  };

  // Сохраняем новое значение счетчика в localStorage
  localStorage.setItem('arrowIdCounter', arrowIdCounter);

  return arrow;

  };
    
  useEffect(() => {
    return () => {};
  }, [shapes]);

  useEffect(() => {
    const rect = workspaceRef.current.getBoundingClientRect();

    const savedShapes = localStorage.getItem("shapes-idef0");
    if (savedShapes) {
      setShapes(JSON.parse(savedShapes));
      setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
      });
    }

    else {
      const initialRectangle = {
        type: "rectangle",
        id: "main-rectangle",
        position: {
          x: Math.round((rect.width - 448) / (2 * cellSize)) * cellSize,
          y: Math.round((rect.height - 298) / (2  * cellSize)) * cellSize
        },
        width: 448,
        height: 298,
        canDrag: false,
        canType: true,
        text: "Диаграмма",
      };
      /*
      const initialArrowInput = createArrow("left", 0, 0, initialRectangle);
      const initialArrowOutput = createArrow("right", 0, 0, initialRectangle);
      const initialArrowMechanism = createArrow("bottom", 0, 0, initialRectangle);
      const initialArrowManagement = createArrow("top", 0, 0, initialRectangle);
      */
      setShapes([initialRectangle/*, initialArrowInput, initialArrowOutput, initialArrowMechanism, initialArrowManagement*/])
    }
  }, []);

  const updateWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleResize = () => {
    if (!resizeTimeout) {
      resizeTimeout = requestAnimationFrame(() => {
        updateWindowSize();
        
        // Установите задержку для второго обновления
        delayTimeout = setTimeout(() => {
          updateWindowSize();
        }, 10); // Задержка в 10 мс (можно изменить по необходимости)

        resizeTimeout = null; // Сброс таймера
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
      const rect = workspaceRef.current.getBoundingClientRect();
      setShapes((prevShapes) => {
        return prevShapes.map((shape) => {
          if (shape.type === "rectangle") {
            const newX = Math.round((rect.width - shape.width) / (2 * cellSize)) * cellSize;
            const newY = Math.round((rect.height - shape.height) / (2 * cellSize)) * cellSize;
            return {
              ...shape,
              position: {
                x: newX,
                y: newY,
              }
            }
          } else if (shape.type === "arrow") {
            const arrowsOnSide = prevShapes.filter(s => s.type === 'arrow' && s.side === shape.side);
            const index = arrowsOnSide.findIndex(s => s.id === shape.id);
            const rectangle = prevShapes.find((s) => s.id === "main-rectangle");
            if (rectangle) {
              let params = {
                  x: rectangle.position.x,
                  y: rectangle.position.y,
                  x1: 10,
                  y1: 10,
                  x2: 10,
                  y2: 10,
                  side: shape.side,
                  offsetX: 0,
                  offsetY: 0,
                  rectangle,
              };
  
              switch (shape.side) {
                  case "left":
                  case "right":
                    params.offsetY = rectangle.height / (arrowsOnSide.length + 1) * (index + 1);
                    break;
                  case "top":
                  case "bottom":
                    params.offsetX = rectangle.width / (arrowsOnSide.length + 1) * (index + 1);
                    break;
                  }
  
              params = arrowPosition(params);

              params.x = Math.round(params.x / cellSize) * cellSize;
              params.y = Math.round(params.y / cellSize) * cellSize;
              return {
                ...shape,
                position: {
                  x: params.x,
                  y: params.y,
                },
                x1: params.x1,
                y1: params.y1,
                x2: params.x2,
                y2: params.y2,
              }
            }
          }
          return shape;
        });
      });
  }, [windowSize]);

  const handleDrop = (e) => {
    e.preventDefault();
    const shape = e.dataTransfer.getData("text/plain");

    if (shape && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const shapeWidth = 150;
      const shapeHeight = 100;
      const offsetX = shapeWidth / 2;
      const offsetY = shapeHeight / 2;
      let newX = Math.round((e.clientX - rect.left - offsetX) / cellSize) * cellSize;
      let newY = Math.round((e.clientY - rect.top - offsetY) / cellSize) * cellSize;
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newY + shapeHeight > rect.height) newY = rect.height - shapeHeight - 4;
      if (newX + shapeWidth > rect.width) newX = rect.width - shapeWidth - 4;
      const newShape = {
        type: shape,
        position: {
          x: newX,
          y: newY
        },
        canDrag: true,
        canType: true,
        width: {shapeWidth},
        height: {shapeHeight},
      };
      setShapes((prevShapes) => [...prevShapes, newShape]);
    }

  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleMouseDown = (index, e) => {
    //e.preventDefault();

    const shape = shapes[index];
    const offsetX = e.clientX - (shape.position.x + workspaceRef.current.getBoundingClientRect().left);
    const offsetY = e.clientY - (shape.position.y + workspaceRef.current.getBoundingClientRect().top);
    
    const handleContextMenu = (e) => {
      e.preventDefault();
      console.log("Context Menu");
    }

    const handleMouseMove = (e) => {
      const rect = workspaceRef.current.getBoundingClientRect();
      if (shape.canDrag) {
        const newShapes = [...shapes];
        let newX = Math.round((e.clientX - rect.left - offsetX) / cellSize) * cellSize;
        let newY = Math.round((e.clientY - rect.top - offsetY) / cellSize) * cellSize;
        const shapeWidth = shape.width;
        const shapeHeight = shape.height;

        // Проверка на выход за пределы рабочего пространства
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newY + shapeHeight > rect.height) newY = rect.height - shapeHeight - 4;
        if (newX + shapeWidth > rect.width) newX = rect.width - shapeWidth - 4;
        
        newShapes[index].position = {
          x: newX,
          y: newY
        };
        setShapes(newShapes);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);
  };

  const updateShapeText = (index, newText) => {
    setShapes(prevShapes => {
      const updatedShapes = [...prevShapes];
      updatedShapes[index].text = newText;
      localStorage.setItem("shapes-idef0", JSON.stringify(updatedShapes));
      return updatedShapes;
    });
  }; 

  const addArrowToShapes = (arrow) => {
    const mainRect = shapes.find((s) => s.id === "main-rectangle");
    const arrowsOnSide = shapes.filter((s) => s.type === "arrow" && s.side === arrow.side).length;
    if (arrowsOnSide < 14) {
        const newArrow = createArrow(arrow.side, 0, 0, mainRect);
        const updatedShapes = [...shapes, newArrow];
        let [il, ir, it, ib] = [0,0,0,0]; // Получаем индекс текущей стрелки

        // Обновляем позиции стрелок
        updatedShapes.forEach((shape) => {
            if (shape.type === "arrow") {
                const arrowsOnSide = updatedShapes.filter(s => s.type === 'arrow' && s.side === shape.side);

                let params = {
                    x: mainRect.position.x,
                    y: mainRect.position.y,
                    x1: 10,
                    y1: 10,
                    x2: 10,
                    y2: 10,
                    side: shape.side,
                    offsetX: 0,
                    offsetY: 0,
                    rectangle: mainRect,
                };

                switch (shape.side) {
                    case "left":
                      params.offsetY = mainRect.height / (arrowsOnSide.length + 1) * (il + 1);
                      il++;
                      break;
                    case "right":
                      params.offsetY = mainRect.height / (arrowsOnSide.length + 1) * (ir + 1);
                      ir++;
                      break;
                    case "top":
                      params.offsetX = mainRect.width / (arrowsOnSide.length + 1) * (it + 1);
                      it++;
                      break;
                    case "bottom":
                      params.offsetX = mainRect.width / (arrowsOnSide.length + 1) * (ib + 1);
                      ib++;
                      break;
                    }

                params = arrowPosition(params);

                params.x = Math.round(params.x / cellSize) * cellSize;
                params.y = Math.round(params.y / cellSize) * cellSize;

                shape.position.x = params.x;
                shape.position.y = params.y;
                shape.x1 = params.x1;
                shape.x2 = params.x2;
                shape.y1 = params.y1;
                shape.y2 = params.y2;
            }
        });

        localStorage.setItem('shapes-idef0', JSON.stringify(updatedShapes));

        setShapes(updatedShapes);
    }
  };

  const updateArrowSpanTexts = (shapes) => {
    shapes.forEach((shape) => {
        if (shape.type === "arrow") {
          shape.text = `Стрелка ${shape.id}`;

          // Обновление текста стрелки
          const spanElement = document.getElementById(`arrow-span-${shape.id}`);
          if (spanElement) {
            setTimeout(() => {
              spanElement.textContent = shape.text;
              const arrowThis = document.getElementById(shape.id);
              arrowThis.text = shape.text;
            }, 10); // Обновление текста в span
          }
        }
    });
  };

  const removeArrowFromShapes = (arrowId) => {
    const mainRect = shapes.find((s) => s.id === "main-rectangle");
    const arrowToRemove = shapes.find((s) => s.id === arrowId);

    if (arrowToRemove) {
        const updatedShapes = shapes.filter((s) => s.id !== arrowId);

        // Обновляем позиции оставшихся стрелок и их текст
        let [il, ir, it, ib] = [0, 0, 0, 0]; // Индексы для каждой стороны
        updatedShapes.forEach((shape) => {
            if (shape.type === "arrow") {
                const arrowsOnSide = updatedShapes.filter(s => s.type === 'arrow' && s.side === shape.side);
                let params = {
                    x: mainRect.position.x,
                    y: mainRect.position.y,
                    x1: 10,
                    y1: 10,
                    x2: 10,
                    y2: 10,
                    side: shape.side,
                    offsetX: 0,
                    offsetY: 0,
                    rectangle: mainRect,
                };

                switch (shape.side) {
                    case "left":
                        params.offsetY = mainRect.height / (arrowsOnSide.length + 1) * (il + 1);
                        il++;
                        break;
                    case "right":
                        params.offsetY = mainRect.height / (arrowsOnSide.length + 1) * (ir + 1);
                        ir++;
                        break;
                    case "top":
                        params.offsetX = mainRect.width / (arrowsOnSide.length + 1) * (it + 1);
                        it++;
                        break;
                    case "bottom":
                        params.offsetX = mainRect.width / (arrowsOnSide.length + 1) * (ib + 1);
                        ib++;
                        break;
                }

                params = arrowPosition(params);
                params.x = Math.round(params.x / cellSize) * cellSize;
                params.y = Math.round(params.y / cellSize) * cellSize;

                shape.position.x = params.x;
                shape.position.y = params.y;
                shape.x1 = params.x1;
                shape.x2 = params.x2;
                shape.y1 = params.y1;
                shape.y2 = params.y2;
            }
        });
        updateArrowSpanTexts(updatedShapes);

        localStorage.setItem('shapes-idef0', JSON.stringify(updatedShapes));
        setShapes(updatedShapes);
    }
    
    window.location.reload();
  };

  return (
    <div ref={workspaceRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="workspace container"
      id="workspace"
      width={windowSize.width}
      height={windowSize.height*0.9}
    >
      <Grid cellSize={cellSize} windowSize={windowSize} />
      {shapes.map((shape, index) => (
        (shape.type === "rectangle" || shape.type === "oval" || shape.type === "arrow") ? (
        <div key={index} 
        onMouseDown={(e) => handleMouseDown(index, e)} 
        style={{ position: 'absolute', left: shape.position.x, top: shape.position.y }}
        >
          {shape.type === "rectangle" ? 
          <RectangleWithArrows
            draggable={false} 
            width={shape.width} 
            height={shape.height} 
            content={shape.text} 
            canDrag={shape.canDrag} 
            canType={shape.canType}
            addArrow={addArrowToShapes}
            shapes={shapes}
            onTextChanged={(newText) => updateShapeText(index, newText)}/> : 
          (shape.type === "oval" ? <Oval draggable={false} /> : 
          (shape.type === "arrow" ? <Arrow draggable={false} 
          id={shape.id}
          x1={shape.x1} 
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          side={shape.side}
          initialText={shape.text}
          canType={shape.canType}
          deleteArrow={removeArrowFromShapes}
          onTextChanged={(newText) => updateShapeText(index, newText)}
          /> : null))}
        </div>) : null
      ))}
    </div>
  );
}

export default WorkspaceContainer;