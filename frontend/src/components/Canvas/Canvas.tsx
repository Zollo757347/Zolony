import { useEffect, useRef, useState } from "react";

import Button from "../Button";
import Message from "../Message";

import Engine from "./Engine";
import Playground from "./Playground";

import { useHook } from "../../hooks/useHook";

import { CanvasProps } from "./typings/types";
import "../../styles/canvas.css";


const Canvas = ({ canvasHeight, canvasWidth, storable, checkable, ...props }: CanvasProps) => {
  const [shiftDown, setShiftDown] = useState(false);
  const [playground, setPlayground] = useState<Playground>();
  const [currentBlock, setCurrentBlock] = useState('');

  const { current: xLen } = useRef('xLen' in props ? props.xLen : props.preLoadData.xLen);
  const { current: yLen } = useRef('xLen' in props ? props.yLen : props.preLoadData.yLen);
  const { current: zLen } = useRef('xLen' in props ? props.xLen : props.preLoadData.zLen);
  const { current: mapName } = useRef('preLoadData' in props ? props.preLoadData.mapName : 'New Map');
  const { current: preLoadData } = useRef('preLoadData' in props ? props.preLoadData : undefined);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const { editMap, user } = useHook();

  useEffect(() => {
    const pg = new Playground({ xLen, yLen, zLen, mapName, preLoadData });
    if (canvasRef.current) {
      pg.initialize(canvasRef.current);
      setPlayground(pg);
      setCurrentBlock(pg.currentBlockName);
    }

    return () => pg.destroy();
  }, [xLen, yLen, zLen, mapName, preLoadData]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    setShiftDown(e.shiftKey);
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLCanvasElement>) {
    setShiftDown(e.shiftKey);
  }

  function handleMouseEnter() {
    window.addEventListener('wheel', preventDefault, { passive: false });
  }

  function handleMouseLeave() {
    window.removeEventListener('wheel', preventDefault, false);
  }

  function handleDrag(e: React.DragEvent<HTMLCanvasElement>) {
    // 拖曳結束前的最後一個事件的座標會是 (0, 0)，因為會嚴重影響到畫面，所以直接擋掉
    if (e.clientX === 0 && e.clientY === 0) return;

    playground?.adjustAngles(e.clientX, e.clientY);
  }
  
  function handleDragStart(e: React.DragEvent<HTMLCanvasElement>) {
    // 把拖曳的殘影改成看不見的元素
    if (spanRef.current) {
      e.dataTransfer.setDragImage(spanRef.current, 0, 0);
    }

    playground?.adjustAngles(e.clientX, e.clientY, true);
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (canvasRef.current) {
      const p = getPosition(canvasRef.current, e);
      playground?.leftClick(p.x, p.y);
    }
  }

  function handleContextMenu(e: React.MouseEvent<HTMLCanvasElement>) {
    // 防止 Context Menu 真的跳出來
    e.preventDefault();

    if (canvasRef.current) {
      const p = getPosition(canvasRef.current, e);
      playground?.rightClick(p.x, p.y, shiftDown);
    }
  }

  function handleScroll(e: React.WheelEvent<HTMLCanvasElement>) {
    playground?.scrollHotbar(e.deltaY);
    setCurrentBlock(playground?.currentBlockName ?? '');
  }

  async function handleSaveMap() {
    if (!playground) return;

    const map = Engine.extract(playground.engine);
    const { error } = await editMap(user.username, map);
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.send({ content: '資料庫連線失敗', type: 'error' });
        return;

      case 'error':
        Message.send({ content: '地圖資料存取失敗', type: 'error' });
        return;

      case 'user':
        Message.send({ content: '此帳號不存在', type: 'error' });
        return;

      case 'map':
        Message.send({ content: `你並沒有名稱為 ${map.mapName} 的地圖`, type: 'error' });
        return;
      
      default: 
        Message.send({ content: `成功儲存地圖 ${map.mapName}`, type: 'success' });
    }
  }

  async function handleCheckMap() {
    if (!playground) return;

    if (await Engine.validate(playground.engine)) {
      Message.send({ content: '恭喜你通過檢查！', type: 'success' });
    }
    else {
      Message.send({ content: '很抱歉，但你沒有通過檢查 :(', type: 'error' });
    }
  }
  
  return (
    <div className="z-canvas-wrapper">
      <div className="z-canvas-wrapper-upper">
        <canvas className="z-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}

          tabIndex={0}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}

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
      <div className="z-canvas-wrapper-middle">{currentBlock}</div>
      {
        storable || (checkable && playground?.engine.validation) ? 
          <div className="z-canvas-wrapper-lower">
            {checkable && playground?.engine.validation ? <Button type="primary" onClick={handleCheckMap}>檢查地圖</Button> : <></>}
            {storable ? <Button type="success" onClick={handleSaveMap}>儲存地圖</Button> : <></>}
          </div> :
          <></>
      }
    </div>
  );
}

function getPosition(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>) {
  const p = canvas.getBoundingClientRect();
  return {
    x: event.clientX - p.left, 
    y: event.clientY - p.top
  };
}

function preventDefault(e: WheelEvent) {
  e.preventDefault();
}

export default Canvas;