import { Rectangle, Oval, Arrow } from "./shapes.js";
import { Grid } from "./grid.js";
import { useState, useRef, useEffect } from "react";

// Контейнер рабочего пространства
export const WorkspaceContainer = () => {
  const [shapes, setShapes] = useState([]);
  const workspaceRef = useRef(null);
  const cellSize = 10;
    
  useEffect(() => {
    const rect = workspaceRef.current.getBoundingClientRect();

    const createArrow = (offsetX, offsetY, x1, y1, x2, y2) => ({
      type: "arrow",
      position: {
        x: Math.round((rect.width + offsetX) / (2 * cellSize)) * cellSize,
        y: Math.round((rect.height + offsetY) / (2 * cellSize)) * cellSize,
      },
      x1,
      y1,
      x2,
      y2,
      canDrag: false,
    });

    const initialRectangle = {
      type: "rectangle",
      position: {
        x: Math.round((rect.width - 450) / (2 * cellSize)) * cellSize,
        y: Math.round((rect.height - 300) / (2  * cellSize)) * cellSize
      },
      width: 450,
      height: 300,
      canDrag: false,
      canType: true,
    };

    const initialArrowInput = createArrow(-685, -10, 0, 10, 100, 10);
    const initialArrowOutput = createArrow(450, -10, 0, 10, 100, 10);
    const initialArrowMechanism = createArrow(-10, 300, 10, 110, 10, 20);
    const initialArrowManagement = createArrow(-10, -540, 10, 0, 10, 100);

    setShapes([initialRectangle, initialArrowInput, initialArrowOutput, initialArrowMechanism, initialArrowManagement]);
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
    e.preventDefault();

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
  
  return (
    <div ref={workspaceRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="workspace container"
      id="workspace"
    >
      <Grid cellSize={cellSize} />
      {shapes.map((shape, index) => (
        (shape.type === "rectangle" || shape.type === "oval" || shape.type === "arrow") ? (
        <div key={index} 
        onMouseDown={(e) => handleMouseDown(index, e)} 
        style={{ position: 'absolute', left: shape.position.x, top: shape.position.y }}
        >
          {shape.type === "rectangle" ? <Rectangle draggable={false} width={shape.width} height={shape.height} canDrag={shape.canDrag} canType={shape.canType}/> : 
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