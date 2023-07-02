import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

const Image = ({ onClick, ...props }) => {
  const imgRef = useRef();

  const [display, setDisplay] = useState(false);
  const [clientWidth, setClientWidth] = useState(document.documentElement.clientWidth - 80);
  const [clientHeight, setClientHeight] = useState(document.documentElement.clientHeight);

  useLayoutEffect(() => {
    function setSize() {
      setClientWidth(document.documentElement.clientWidth - 80);
      setClientHeight(document.documentElement.clientHeight);
    }

    window.addEventListener('resize', setSize);
    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('wheel', preventDefault, false);
    };
  }, []);

  let attributes = { style: { display: 'none' } };

  if (imgRef.current) {
    let left = 80, top = 0;
    let width = undefined, height = undefined;

    const { naturalWidth, naturalHeight } = imgRef.current;
    const direction = limitedDirection(clientWidth, clientHeight, naturalWidth, naturalHeight);

    if (direction === 'width') {
      width = clientWidth;
      height = undefined;
  
      const marginHeight = naturalHeight * clientWidth / naturalWidth;
      top += (clientHeight - marginHeight + 1) >> 1;
    }
    else {
      width = undefined;
      height = clientHeight;
  
      const marginWidth = naturalWidth * clientHeight / naturalHeight;
      left += (clientWidth - marginWidth + 1) >> 1;
    }

    attributes = {
      width, height, 
      style: {
        left, top, 
        display: display ? 'block' : 'none', 
        position: 'fixed', 
        zIndex: 10000
      }
    };
  }

  function handleImgClick() {
    window.addEventListener('wheel', preventDefault, { passive: false });
    setDisplay(!display);
    onClick?.();
  }

  function handleDivClick() {
    setDisplay(!display);
    window.removeEventListener('wheel', preventDefault, false);
  }

  return (
    <>
      <StyledImage onClick={handleImgClick} {...props} />
      <BackgroundDiv onClick={handleDivClick} width={clientWidth + 3} height={clientHeight + 3} show={display}></BackgroundDiv>
      <img ref={imgRef} alt={props.alt} src={props.src} draggable={false} {...attributes} />
      <ExitDiv onClick={handleDivClick} show={display}>X</ExitDiv>
    </>
  );
}

function preventDefault(e) {
  e.preventDefault();
}

function limitedDirection(clientWidth, clientHeight, naturalWidth, naturalHeight) {
  return clientWidth * naturalHeight > clientHeight * naturalWidth ? 'height' : 'width';
}

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
  right: 0;
  bottom: 0;
  z-index: 9999;
`;

const ExitDiv = styled.div`
  background-color: rgba(50, 50, 50, 0.7);
  color: white;
  position: fixed;
  right: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  z-index: 10001;

  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

export default Image;