import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledImage = styled.img`
  &:hover {
    cursor: pointer;
  }
`;

const BackgroundDiv = styled.div.attrs(props => ({
  style: {
    width: props.width, 
    height: props.height, 
    display: props.show ? 'block' : 'none'
  }
}))`
  background-color: rgba(100, 100, 100, 0.7);
  position: fixed;
  left: 0;
  top: 80px;
  z-index: 20109;
`;

const ExitDiv = styled.div`
  background-color: rgba(50, 50, 50, 0.7);
  color: white;
  position: fixed;
  right: 10px;
  top: 90px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  z-index: 20111;

  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const Image = ({ onClick, ...props }) => {
  const imgRef = useRef();

  const [display, setDisplay] = useState(false);
  const [clientWidth, setClientWidth] = useState(document.documentElement.clientWidth);
  const [clientHeight, setClientHeight] = useState(document.documentElement.clientHeight - 80);

  useLayoutEffect(() => {
    function setSize() {
      setClientWidth(document.documentElement.clientWidth);
      setClientHeight(document.documentElement.clientHeight - 80);
    }

    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, []);

  let attributes = { style: { display: 'none' } };

  if (imgRef.current) {
    let left = 0, top = 80;
    let width = undefined, height = undefined;

    const { naturalWidth, naturalHeight } = imgRef.current;
    const direction = limitedDirection(clientWidth, clientHeight, naturalWidth, naturalHeight);

    if (direction === 'width') {
      width = clientWidth;
      height = undefined;
  
      const marginHeight = naturalHeight * clientWidth / naturalWidth;
      top += (clientHeight - marginHeight) >> 1;
    }
    else {
      width = undefined;
      height = clientHeight;
  
      const marginWidth = naturalWidth * clientHeight / naturalHeight;
      left += (clientWidth - marginWidth) >> 1;
    }

    attributes = {
      width, height, 
      style: {
        left, top, 
        display: display ? 'block' : 'none', 
        position: 'fixed', 
        zIndex: 20110
      }
    };
  }

  function handleImgClick() {
    setDisplay(!display);
    onClick?.();
  }

  function handleDivClick() {
    setDisplay(!display);
  }

  return (
    <>
      <StyledImage onClick={handleImgClick} {...props} />
      <BackgroundDiv onClick={handleDivClick} width={clientWidth} height={clientHeight} show={display}></BackgroundDiv>
      <img ref={imgRef} alt={props.alt} src={props.src} draggable={false} {...attributes} />
      <ExitDiv onClick={handleDivClick} show={display}>X</ExitDiv>
    </>
  );
}

function limitedDirection(clientWidth, clientHeight, naturalWidth, naturalHeight) {
  return clientWidth * naturalHeight > clientHeight * naturalWidth ? 'height' : 'width';
}

export default Image;