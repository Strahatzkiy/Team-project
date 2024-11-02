import { Rectangle, Oval, Arrow } from "./shapes.js";
import { Grid } from "./grid.js";
import { useState, useRef, useEffect } from "react";

// Контейнер рабочего пространства
export const WorkspaceContainer = () => {
  const [shapes, setShapes] = useState([]);
  const workspaceRef = useRef(null);
  const cellSize = 10;
    
  useEffect(() => {
    const initialRectangle = {
      type: "rectangle",
      position: {
        x: 30,
        y: 30
      }
    };
    setShapes([initialRectangle]);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const shape = e.dataTransfer.getData("text/plain");
    const { clientX, clientY } = e;

    if (shape && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const newShape = {
        type: shape,
        position: {
          x: Math.round((clientX - rect.left - 75) / cellSize) * cellSize,
          y: Math.round((clientY - rect.top - 50) / cellSize) * cellSize
        }
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
      const newShapes = [...shapes];
      let newX = Math.round((e.clientX - rect.left - offsetX) / cellSize) * cellSize;
      let newY = Math.round((e.clientY - rect.top - offsetY) / cellSize) * cellSize;
      const shapeWidth = 150;
      const shapeHeight = 100;

      // Проверка на выход за пределы рабочего пространства
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + shapeWidth > rect.width) newX = rect.width - shapeWidth - 4;
      if (newY + shapeHeight > rect.height) newY = rect.height - shapeHeight - 4;

      newShapes[index].position = {
        x: newX,
        y: newY
      };
      setShapes(newShapes);
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
    >
      <Grid cellSize={cellSize} />
      {shapes.map((shape, index) => (
        (shape.type === "rectangle" || shape.type === "oval" || shape.type === "arrow") ? (
        <div key={index} 
        onMouseDown={(e) => handleMouseDown(index, e)} 
        style={{ position: 'absolute', left: shape.position.x, top: shape.position.y }}
        >
          {shape.type === "rectangle" ? <Rectangle draggable={false} /> : 
          (shape.type === "oval" ? <Oval draggable={false} /> : 
          (shape.type === "arrow" ? <Arrow draggable={false} 
          x1={shape.position.x} 
          y1={shape.position.y}
          x2={shape.position.x + 100}
          y2={shape.position.y}
          /> : null))}
        </div>) : null
      ))}
    </div>
  );
}

export default WorkspaceContainer;