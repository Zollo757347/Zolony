import { UserOutlined } from '@ant-design/icons';
import { Input, Modal, message as Message } from 'antd';
import { useState } from 'react';
import './css/Modal.css';
import { useHook } from '../hooks/useHook';

const { TextArea } = Input;  
const Modal_Components = ({ open, setOpen }) => {
  const [modalUsername, setModalUsername] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalCheckPassword, setModalCheckPassword] = useState('');
  const [modalNewPassword, setModalNewPassword] = useState('');
  const [modalAvatar, setModalAvatar] = useState('');
  const [modalBio, setModalBio] = useState('');

  const { login, createUser, editUser, deleteUser, username } = useHook();

  const closeModal = () => {
    setModalUsername('');
    setModalPassword('');
    setModalCheckPassword('');
    setModalNewPassword('');
    setModalAvatar('');
    setModalBio('');
    setOpen(0);
  }

  const handleOk = async () => {
    // 登入
    if (open === 1) {
      if (!modalUsername) {
        Message.error({ content: '請輸入你的帳號名稱', duration: 1 });
        return;
      }
      if (!modalPassword) {
        Message.error({ content: '請輸入你的密碼', duration: 1 });
        return;
      }

      const { error } = await login(modalUsername, modalPassword);
      switch (error) {
        case 'loading': return;

        case 'connection':
          Message.error({ content: '資料庫連線失敗', duration: 1 });
          return;

        case 'error':
          Message.error({ content: '使用者資料存取失敗', duration: 1 });
          return;

        case 'username':
          Message.error({ content: '此帳號不存在', duration: 1 });
          return;

        case 'password':
          Message.error({ content: '密碼輸入錯誤', duration: 1 });
          return;
        
        default: 
          Message.success({ content: '登入成功！', duration: 1 });
          closeModal();
      }
    }

    // 註冊
    else if (open === 2) {
      if (modalPassword !== modalCheckPassword) {
        Message.error({ content: '兩組密碼不相同！', duration: 1 });
      }
      else {
        const { error } = await createUser(modalUsername, modalPassword);
        switch (error) {
          case 'loading': return;
  
          case 'connection':
            Message.error({ content: '資料庫連線失敗', duration: 1 });
            return;
  
          case 'error':
            Message.error({ content: '使用者資料存取失敗', duration: 1 });
            return;
  
          case 'user':
            Message.error({ content: '該帳號已經存在', duration: 1 });
            return;
          
          default: 
            Message.success({ content: '成功建立帳號！', duration: 1 });
            closeModal();
        }
      }
    }

    // 編輯個人資料
    else if (open === 3) {
      if (modalNewPassword !== modalCheckPassword) {
        Message.error({ content: '兩組密碼不相同！', duration: 1 });
      }

      const { error } = await editUser({
        username, 
        password: modalPassword, 
        newPassword: modalNewPassword, 
        newAvatar: modalAvatar, 
        newBio: modalBio
      });
      switch (error) {
        case 'loading': return;

        case 'connection':
          Message.error({ content: '資料庫連線失敗', duration: 1 });
          return;

        case 'error':
          Message.error({ content: '使用者資料存取失敗', duration: 1 });
          return;

        case 'user':
          Message.error({ content: '此帳號不存在', duration: 1 });
          return;

        case 'password':
          Message.error({ content: '密碼輸入錯誤', duration: 1 });
          return;
        
        default: 
          Message.success({ content: '自介更新成功！', duration: 1 });
          closeModal();
      }
    }

    // 刪除帳號
    else if (open === 4) {
      if (!modalPassword) {
        Message.error({ content: '請輸入你的密碼', duration: 1 });
        return;
      }

      const { error } = await deleteUser(username, modalPassword);
      switch (error) {
        case 'loading': return;

        case 'connection':
          Message.error({ content: '資料庫連線失敗', duration: 1 });
          return;

        case 'error':
          Message.error({ content: '使用者資料存取失敗', duration: 1 });
          return;

        case 'user':
          Message.error({ content: '此帳號不存在', duration: 1 });
          return;

        case 'password':
          Message.error({ content: '密碼輸入錯誤', duration: 1 });
          return;
        
        default: 
          Message.success({ content: '帳號已成功刪除', duration: 1 });
          closeModal();
      }
    }
  }

  const signInModal = <>
    <Input placeholder="輸入你的帳號" value={modalUsername} prefix={<UserOutlined />} onChange={e => setModalUsername(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的密碼" value={modalPassword} onChange={e => {setModalPassword(e.target.value)}}/>
    <br/>
  </>;
  
  const signUpModal = <>
    <Input placeholder="輸入你的帳號" value={modalUsername} prefix={<UserOutlined />} onChange={e => setModalUsername(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的密碼" value={modalPassword} onChange={e => setModalPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="確認你的密碼" value={modalCheckPassword} onChange={e => setModalCheckPassword(e.target.value)}/>
  </>;

  const modifyModal = <>
    <Input.Password placeholder="輸入你的原密碼" value={modalPassword} onChange={e => setModalPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的新密碼" value={modalNewPassword} onChange={e => setModalNewPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="確認你的密碼" value={modalCheckPassword} onChange={e => setModalCheckPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input placeholder="輸入你的新頭像" value={modalAvatar} onChange={e => setModalAvatar(e.target.value)}/>
    <br/>
    <br/>
    <TextArea placeholder="輸入你的自介" value={modalBio} rows={4} onChange={e => setModalBio(e.target.value)}/>
  </>;

  const deleteModal = <>
    <span>請輸入你的密碼以確認將此帳號刪除，注意此動作無法被復原</span>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的密碼" value={modalPassword} onChange={e => setModalPassword(e.target.value)}/>
  </>;

  return (
    <Modal
      title={["登入","註冊", "編輯個人資料"][open - 1]}
      centered
      open={(open > 0)}
      onOk={() => handleOk()}
      onCancel={() => closeModal()}
    >
      {[signInModal, signUpModal, modifyModal, deleteModal][open - 1]}
    </Modal>
  );
};

export default Modal_Components;