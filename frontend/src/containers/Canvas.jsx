import { useEffect, useRef } from "react";
import Playground from "../components/Playground/Playground";

function getPosition(canvas, event) {
  const p = canvas.getBoundingClientRect();
  return {
    x: event.clientX - p.left, 
    y: event.clientY - p.top
  };
}

const Canvas = ({ canvasWidth, canvasHeight, xLen, yLen, zLen }) => {
  const canvasRef = useRef(<canvas></canvas>);
  const spanRef = useRef();

  const playgroundRef = useRef(new Playground({ canvasWidth, canvasHeight, xLen, yLen, zLen }));

  useEffect(() => {
    playgroundRef.current.renderOn(canvasRef.current);
  }, []);

  function handleDrag(e) {
    if (e.clientX === 0 || e.clientY === 0) return;
    const canvas = canvasRef.current;
    playgroundRef.current.adjustAngles(e.clientX, e.clientY);
    playgroundRef.current.renderOn(canvas);
  }
  
  function handleDragStart(e) {
    playgroundRef.current.adjustAngles(e.clientX, e.clientY, true);
    e.dataTransfer.setDragImage(spanRef.current, 0, 0);
  }

  function handleClick(e) {
    const canvas = canvasRef.current;
    const p = getPosition(canvas, e);
    
    playgroundRef.current.destroy(p.x, p.y);
    playgroundRef.current.renderOn(canvas);
  }

  function handleContextMenu(e) {
    e.preventDefault();

    const canvas = canvasRef.current;
    const p = getPosition(canvas, e);
    
    playgroundRef.current.place(p.x, p.y);
    playgroundRef.current.renderOn(canvas);
  }

  function handleScroll(e) {
    playgroundRef.current.scrollHotbar(e.deltaY);
  }
  
  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        
        draggable={true}
        onDrag={handleDrag}
        onDragStart={handleDragStart}

        onClick={handleClick}
        onContextMenu={handleContextMenu}

        onWheelCapture={handleScroll}
      />
      <span ref={spanRef} style={{ display: 'none' }} />
    </>
  )
}

export default Canvas;