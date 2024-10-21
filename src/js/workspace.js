import { Rectangle, Oval, Arrow } from "./shapes.js";
import { Grid } from "./grid.js";
import { useState, useRef } from "react";

// Контейнер рабочего пространства
export const WorkspaceContainer = () => {
  const [shapes, setShapes] = useState([]);
  const workspaceRef = useRef(null);
  const cellSize = 15;
  const handleDrop = (e) => {
    e.preventDefault();
    const shape = e.dataTransfer.getData("text/plain");
    const { clientX, clientY } = e;

    if (shape && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const newShape = {
        type: shape,
        position: {
          x: Math.round((clientX - rect.left - 50) / cellSize) * cellSize,
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

    const handleMouseMove = (e) => {
      const newShapes = [...shapes];
      newShapes[index].position = {
        x: Math.round((e.clientX - workspaceRef.current.getBoundingClientRect().left - offsetX) / cellSize) * cellSize,
        y: Math.round((e.clientY - workspaceRef.current.getBoundingClientRect().top - offsetY) / cellSize) * cellSize
      };
      setShapes(newShapes);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
    return (
      <div ref={workspaceRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="workspace container"
      >
        <Grid cellSize={cellSize} />
        {shapes.map((shape, index) => (
          <div key={index} onMouseDown={(e) => handleMouseDown(index, e)} style={{ position: 'absolute', left: shape.position.x, top: shape.position.y }}
          >
            {shape.type === "rectangle" ? <Rectangle draggable={false} /> : 
            (shape.type === "oval" ? <Oval draggable={false} /> : 
            (shape.type === "arrow" ? <Arrow draggable={false} 
            x1={shape.position.x} 
            y1={shape.position.y}
            x2={shape.position.x + 100}
            y2={shape.position.y}
            /> : null))}
          </div>
        ))}
      </div>
    );
  }

export default WorkspaceContainer;