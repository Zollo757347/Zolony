import { Fragment, useState } from "react";
import styled from "styled-components";
import Button, { ButtonTexture } from "./Button";

const Modal = ({ collapsed, setCollapsed, title, items, onConfirm, onCancel }) => {
  const [data, setData] = useState([]);

  function handleChange(value, index) {
    const newData = [];
    for (let i = 0; i < items.length; i++) {
      newData[i] = i === index ? value : data[i] ?? '';
    }
    setData(newData);
  }

  function handleConfirm() {
    setData([]);
    setCollapsed(true);
    onConfirm?.(data);
  }

  function handleCancel() {
    setData([]);
    setCollapsed(true);
    onCancel?.();
  }

  return (
    <ModalWrapper collapsed={collapsed}>
      <StyledGhostDiv onClick={handleCancel} />
      <StyleModal>
        <StyledTitle>{title}</StyledTitle>
        <InputArea>{
          items.map((item, i) => {
            item.type = item.type === 'normal' ? undefined : item.type;
            return <Fragment key={i}>
              <span>{item.title}</span>
              <br />
              <StyledInput value={data[i] ?? ''} placeholder={item.placeholder} type={item.type} onChange={(e) => handleChange(e.target.value, i)} />
              { i === items.length - 1 ? <></> : <><br /><br /></> }
            </Fragment>;
          })
        }</InputArea>
        <ButtonArea>
          <Button texture={ButtonTexture.Primary} onClick={handleConfirm}>確定</Button>
          <Button texture={ButtonTexture.Secondary} onClick={handleCancel}>取消</Button>
        </ButtonArea>
      </StyleModal>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 20110;

  display: flex;
  justify-content: center;
  align-items: center;
  
  opacity: ${props => props.collapsed ? 0 : 1};
  ${props => props.collapsed ? "transform: translateY(100%);" : ""};
  transition: transform 0.3s, opacity 0.3s ease-in;
`;

const StyleModal = styled.div`
  background-color: rgb(255, 246, 168);
  width: 450px;
  padding: 10px;
  border-radius: 0.5em;
  box-shadow: 0 0 15px rgba(130, 130, 130, 0.3);

  position: relative;
  bottom: 40px;
  z-index: 1;
`;

const StyledGhostDiv = styled.div`
  background-color: #888888;
  opacity: 0.1;
  height: 100%;
  width: 100%;

  position: fixed;
`;

const StyledTitle = styled.div`
  padding: 5px;
  text-align: center;
  font-size: 1.5em;
`;

const InputArea = styled.div`
  margin-bottom: 5px;
  padding: 10px;
`;

const ButtonArea = styled.div`
  margin-top: 5px;

  display: flex;
  justify-content: flex-end;

  & > * {
    width: 60px;
  }
`;

const StyledInput = styled.input`
  width: 95%;
  height: 1.5em;
  padding: 0.3em 0.7em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;

  border: 1px solid rgb(245, 213, 37);
  border-radius: 3px;

  &:focus {
    outline: 2px solid rgb(255, 237, 68);
  }
`;

export default Modal;