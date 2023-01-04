import React from 'react';
import { Modal } from 'antd';

const modal = ({open, setOpen}) => {
  return (
      <Modal
        title="Modal 1000px width"
        centered
        open={(open > 0)}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
  );
};

export default modal;