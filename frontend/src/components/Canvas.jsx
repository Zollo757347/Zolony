import { message as Message } from "antd";
import { useEffect, useRef, useState } from "react";
import { ButtonTexture } from "../classes/ButtonTexture";
import { Engine, Playground } from "../classes/Playground";
import { useHook } from "../hooks/useHook";
import Button from "./Button";
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

const Canvas = ({ canvasWidth, canvasHeight, xLen, yLen, zLen, storable, checkable, preLoadData }) => {
  const [shiftDown, setShiftDown] = useState(false);
  const [playground, setPlayground] = useState();

  const canvasRef = useRef();
  const spanRef = useRef();

  const { editMap, username } = useHook();

  useEffect(() => {
    const pg = new Playground({ canvasWidth, canvasHeight, xLen, yLen, zLen, preLoadData });
    pg.initialize(canvasRef.current);
    setPlayground(pg);
    
    return () => pg.destroy();
  }, [canvasWidth, canvasHeight, xLen, yLen, zLen, preLoadData]);

  function handleKeyDown(e) {
    setShiftDown(e.shiftKey);
  }

  function handleKeyUp(e) {
    setShiftDown(e.shiftKey);
  }

  function handleMouseMove(e) {
    const p = getPosition(canvasRef.current, e);
    playground?.setCursor(p.x, p.y);
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

    playground?.adjustAngles(e.clientX, e.clientY);
  }
  
  function handleDragStart(e) {
    // 把拖曳的殘影改成看不見的元素
    e.dataTransfer.setDragImage(spanRef.current, 0, 0);

    playground?.adjustAngles(e.clientX, e.clientY, true);
  }

  function handleClick(e) {
    const canvas = canvasRef.current;
    const p = getPosition(canvas, e);
    
    playground?.leftClick(p.x, p.y);
  }

  function handleContextMenu(e) {
    // 防止 Context Menu 真的跳出來
    e.preventDefault();

    const canvas = canvasRef.current;
    const p = getPosition(canvas, e);
    
    playground?.rightClick(p.x, p.y, shiftDown);
  }

  function handleScroll(e) {
    playground?.scrollHotbar(e.deltaY);
  }

  async function handleSaveMap() {
    if (!playground) return;

    const map = Engine.extract(playground.engine);
    const { error } = await editMap(username, map);
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.error({ content: '資料庫連線失敗', duration: 1 });
        return;

      case 'error':
        Message.error({ content: '地圖資料存取失敗', duration: 1 });
        return;

      case 'user':
        Message.error({ content: '此帳號不存在', duration: 1 });
        return;

      case 'map':
        Message.error({ content: `你並沒有名稱為 ${map.mapName} 的地圖`, duration: 1 });
        return;
      
      default: 
        Message.success({ content: `成功儲存地圖 ${map.mapName}`, duration: 1 });
    }
  }

  async function handleCheckMap() {
    if (!playground) return;

    if (await Engine.validate(playground.engine, playground.engine.validation)) {
      Message.success({ content: '恭喜你通過檢查！', duration: 2 });
    }
    else {
      Message.error({ content: '很抱歉，但你沒有通過檢查 :(', duration: 2 });
    }
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
        storable || (checkable && playground?.engine.validation) ? 
          <div className="redstone-canvas-bottom">
            {checkable && playground?.engine.validation ? <Button texture={ButtonTexture.Primary} onClick={handleCheckMap}>檢查地圖</Button> : <></>}
            {storable ? <Button texture={ButtonTexture.Success} onClick={handleSaveMap}>儲存地圖</Button> : <></>}
          </div> :
          <></>
      }
    </div>
  );
}

export default Canvas;