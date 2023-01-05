import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { Engine, Playground } from "../classes/Playground";
import { UseHook } from "../hook/usehook";
import "./css/Canvas.css"

function getPosition(canvas, event) {
  const p = canvas.getBoundingClientRect();
  return {
    x: event.clientX - p.left, 
    y: event.clientY - p.top
  };
}

function preventDefault(e) {
  e.preventDefault();
}

const Canvas = ({ canvaswidth: canvasWidth, canvasheight: canvasHeight, xlen: xLen, ylen: yLen, zlen: zLen, storable, preloaddata: preLoadData }) => {
  const canvasRef = useRef(<canvas></canvas>);
  const spanRef = useRef(<span></span>);
  const playgroundRef = useRef(new Playground({ canvasWidth, canvasHeight, xLen, yLen, zLen, preLoadData }));

  const [shiftDown, setShiftDown] = useState(false);
  const { editMyMap, user, password } = UseHook();

  useEffect(() => {
    playgroundRef.current.setCanvas(canvasRef.current);
  }, []);

  function handleKeyDown(e) {
    setShiftDown(e.shiftKey);
  }

  function handleKeyUp(e) {
    setShiftDown(e.shiftKey);
  }

  function handleMouseMove(e) {
    const p = getPosition(canvasRef.current, e);
    playgroundRef.current.setCursor(p.x, p.y);
  }

  function handleMouseEnter() {
    document.addEventListener('wheel', preventDefault, { passive: false });
  }

  function handleMouseLeave() {
    document.removeEventListener('wheel', preventDefault, false);
  }

  function handleDrag(e) {
    // 拖曳結束前的最後一個事件的座標會是 (0, 0)，因為會嚴重影響到畫面，所以直接擋掉
    if (e.clientX === 0 && e.clientY === 0) return;

    playgroundRef.current.adjustAngles(e.clientX, e.clientY);
  }
  
  function handleDragStart(e) {
    // 把拖曳的殘影改成看不見的元素
    e.dataTransfer.setDragImage(spanRef.current, 0, 0);

    playgroundRef.current.adjustAngles(e.clientX, e.clientY, true);
  }

  function handleClick(e) {
    const canvas = canvasRef.current;
    const p = getPosition(canvas, e);
    
    playgroundRef.current.leftClick(p.x, p.y);
  }

  function handleContextMenu(e) {
    // 防止 Context Menu 真的跳出來
    e.preventDefault();

    const canvas = canvasRef.current;
    const p = getPosition(canvas, e);
    
    playgroundRef.current.rightClick(p.x, p.y, shiftDown);
  }

  function handleScroll(e) {
    playgroundRef.current.scrollHotbar(e.deltaY);
  }

  function handleSaveMap() {
    const map = Engine.extract(playgroundRef.current.engine);
    editMyMap(user, password, map);
  }
  
  return (
    <div className="redstone-canvas">
      <div className="redstone-canvas-top">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}

          tabIndex={0}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}

          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          
          draggable={true}
          onDrag={handleDrag}
          onDragStart={handleDragStart}

          onClick={handleClick}
          onContextMenu={handleContextMenu}

          onWheelCapture={handleScroll}
        />
        <span ref={spanRef} style={{ display: 'none' }} />
      </div>
      {
        storable ? 
          <div className="redstone-canvas-bottom">
            <Button onClick={handleSaveMap}>儲存地圖</Button>
          </div> :
          <></>
      }
    </div>
  )
}

export default Canvas;