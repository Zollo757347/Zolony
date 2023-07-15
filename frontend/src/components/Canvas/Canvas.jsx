import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

import Button from "../Button";
import Message from "../Message";

import Engine from "./Engine";
import Playground from "./Playground";

import { useHook } from "../../hooks/useHook";

/**
 * 
 * @param {any} param0 
 * @returns 
 */
const Canvas = ({ canvasWidth, canvasHeight, xLen, yLen, zLen, storable, checkable, preLoadData }) => {
  const [shiftDown, setShiftDown] = useState(false);
  const [playground, setPlayground] = useState();
  const [currentBlock, setCurrentBlock] = useState('');

  const canvasRef = useRef();
  const spanRef = useRef();

  const { editMap, user } = useHook();

  useEffect(() => {
    const pg = new Playground({ canvasWidth, canvasHeight, xLen, yLen, zLen, preLoadData });
    pg.initialize(canvasRef.current);
    setPlayground(pg);
    setCurrentBlock(pg.currentBlockName ?? '');
    
    return () => pg.destroy();
  }, [canvasWidth, canvasHeight, xLen, yLen, zLen, preLoadData]);

  function handleKeyDown(e) {
    setShiftDown(e.shiftKey);
  }

  function handleKeyUp(e) {
    setShiftDown(e.shiftKey);
  }

  function handleMouseEnter() {
    window.addEventListener('wheel', preventDefault, { passive: false });
  }

  function handleMouseLeave() {
    window.removeEventListener('wheel', preventDefault, false);
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

    if (await Engine.validate(playground.engine, playground.engine.validation)) {
      Message.send({ content: '恭喜你通過檢查！', type: 'success' });
    }
    else {
      Message.send({ content: '很抱歉，但你沒有通過檢查 :(', type: 'error' });
    }
  }
  
  return (
    <CanvasWrapper>
      <UpperCanvasWrapper>
        <StyledCanvas
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
      </UpperCanvasWrapper>
      <MiddleCanvasWrapper>{currentBlock}</MiddleCanvasWrapper>
      {
        storable || (checkable && playground?.engine.validation) ? 
          <LowerCanvasWrapper>
            {checkable && playground?.engine.validation ? <Button type="primary" onClick={handleCheckMap}>檢查地圖</Button> : <></>}
            {storable ? <Button type="success" onClick={handleSaveMap}>儲存地圖</Button> : <></>}
          </LowerCanvasWrapper> :
          <></>
      }
    </CanvasWrapper>
  );
}

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

const CanvasWrapper = styled.div`
  border: 3px #D2A46B solid;
  border-radius: 0.3em;
  width: max-content;
`;

const UpperCanvasWrapper = styled.div`
  text-align: center;
`;

const MiddleCanvasWrapper = styled.div`
  text-align: center;
`;

const LowerCanvasWrapper = styled.div`
  padding-top: 5px;
  padding-bottom: 10px;
  text-align: center;
`;

const StyledCanvas = styled.canvas`
  &:focus {
    padding: 0;
    outline: 0;
  }
`;

export default Canvas;