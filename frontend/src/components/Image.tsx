import { useLayoutEffect, useRef, useState } from "react";

import "../styles/image.css";

interface ImageProps {
  src: string;
  alt: string;
  onClick?: () => {};
  [key: string]: any;
}

interface ImageAttributes {
  width?: number;
  height?: number;
  style: {
    display?: 'block' | 'none';
    left?: number;
    top?: number;
    position?: 'fixed';
    zIndex?: 10000
  }
}

const Image = ({ src, alt, onClick, ...props }: ImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

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

  let attributes: ImageAttributes = { style: { display: 'none' } };

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
      <img className="z-image" src={src} alt={alt} onClick={handleImgClick} {...props} />
      <img ref={imgRef} src={src} alt={alt} draggable={false} {...attributes} />
      {
        display ? <>
          <div className="z-image-ghostdiv" onClick={handleDivClick} style={{ width: clientWidth + 3, height: clientHeight + 3 }}></div>
          <div className="z-image-exitdiv" onClick={handleDivClick}>X</div>
        </> : <></>
      }
    </>
  );
}
export default Image;

function preventDefault(e: WheelEvent) {
  e.preventDefault();
}

function limitedDirection(clientWidth: number, clientHeight: number, naturalWidth: number, naturalHeight: number) {
  return clientWidth * naturalHeight > clientHeight * naturalWidth ? 'height' : 'width';
}