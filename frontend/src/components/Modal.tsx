import { Fragment, useState } from "react";
import Button from "./Button";

interface ModalProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  items: {
    title: string;
    placeholder: string;
    type?: React.HTMLInputTypeAttribute | 'normal';
  }[];
  onConfirm?: (v: string[]) => void;
  onCancel?: () => void;
}

const Modal = ({ collapsed, setCollapsed, title, items, onConfirm, onCancel }: ModalProps) => {
  const [data, setData] = useState<string[]>([]);

  function handleChange(value: string, index: number) {
    const newData: string[] = [];
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
    <div className={collapsed ? "z-modal-wrapper z-modal-wrapper-collapsed" : "z-modal-wrapper"}>
      <div className="z-modal-ghostdiv" onClick={handleCancel} />
      <div className="z-modal">
        <div className="z-modal-title">{title}</div>
        <div className="z-modal-inputarea">{
          items.map((item, i) => {
            item.type = item.type === 'normal' ? undefined : item.type;
            return <Fragment key={i}>
              <span>{item.title}</span>
              <br />
              <input className="z-modal-input" value={data[i] ?? ''} placeholder={item.placeholder} type={item.type} onChange={(e) => handleChange(e.target.value, i)} />
              { i === items.length - 1 ? <></> : <><br /><br /></> }
            </Fragment>;
          })
        }</div>
        <div className="z-modal-buttonarea">
          <Button type="primary" onClick={handleConfirm}>確定</Button>
          <Button type="secondary" onClick={handleCancel}>取消</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;