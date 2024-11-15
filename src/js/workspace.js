import { Rectangle, Oval, Arrow } from "./shapes.js";
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

      const arrowPosition = (params) => {
        const { side, offsetX, offsetY, rectangle } = params;
        switch (side) {
          case "top":
            params.x += rectangle.width / 2 + offsetX;
            params.y -= 120;
            params.y1 = 0;
            params.y2 = 100;
            break;
          case "bottom":
            params.x += rectangle.width / 2 + offsetX;
            params.y += rectangle.height;
            params.y1 = 120;
            params.y2 = 20;
            break;
          case "left":
            params.x -= 120;
            params.y += rectangle.height / 2 + offsetY;
            params.x1 = 0;
            params.x2 = 100;
            break;
          case "right":
            params.x += rectangle.width;
            params.y += rectangle.height / 2 + offsetY;
            params.x1 = 0;
            params.x2 = 100;
            break;
        }
        return (params);
      }
    
  useEffect(() => {
    const rect = workspaceRef.current.getBoundingClientRect();

    const savedShapes = localStorage.getItem("shapes-idef0");
    if (savedShapes) {
      setShapes(JSON.parse(savedShapes));
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
        return {
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
        };
  
      };

      const initialArrowInput = createArrow("left", 0, 0, initialRectangle);
      const initialArrowOutput = createArrow("right", 0, 0, initialRectangle);
      const initialArrowMechanism = createArrow("bottom", 0, 0, initialRectangle);
      const initialArrowManagement = createArrow("top", 0, 0, initialRectangle);

      setShapes([initialRectangle, initialArrowInput, initialArrowOutput, initialArrowMechanism, initialArrowManagement])
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
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
            const rectangle = prevShapes.find((s) => s.id === "main-rectangle");
            if (rectangle) {
              let params = {
                x: Math.round((rect.width - rectangle.width) / (2 * cellSize)) * cellSize,
                y: Math.round((rect.height - rectangle.height) / (2 * cellSize)) * cellSize,
                x1: 10,
                y1: 10,
                x2: 10,
                y2: 10,
                side: shape.side,
                offsetX: 0,
                offsetY: 0,
                rectangle
              };
              params = arrowPosition(params);
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
      console.log(rect);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

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
          <Rectangle 
            draggable={false} 
            width={shape.width} 
            height={shape.height} 
            content={shape.text} 
            canDrag={shape.canDrag} 
            canType={shape.canType}
            onTextChanged={(newText) => updateShapeText(index, newText)}/> : 
          (shape.type === "oval" ? <Oval draggable={false} /> : 
          (shape.type === "arrow" ? <Arrow draggable={false} 
          x1={shape.x1} 
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          /> : null))}
        </div>) : null
      ))}
    </div>
  );
}

export default WorkspaceContainer;