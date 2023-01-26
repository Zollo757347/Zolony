import { UserOutlined } from '@ant-design/icons';
import { Input, Modal, message as Message } from 'antd';
import { useRef } from 'react';
import './css/Modal.css';
import { useHook } from '../hooks/useHook';

const Modal_Components = ({ open, setOpen }) => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const checkPasswordRef = useRef();
  const newPasswordRef = useRef();
  const avatarRef = useRef();
  const bioRef = useRef();

  const { login, createUser, editUser, deleteUser, username } = useHook();

  const handleOk = async () => {
    // 登入
    if (open === 1) {
      const modalUsername = usernameRef.current.input.value;
      const modalPassword = passwordRef.current.input.value;

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

        case 'user':
          Message.error({ content: '此帳號不存在', duration: 1 });
          return;

        case 'password':
          Message.error({ content: '密碼輸入錯誤', duration: 1 });
          return;
        
        default: 
          Message.success({ content: '登入成功！', duration: 1 });
          setOpen(0);
      }
    }

    // 註冊
    else if (open === 2) {
      const modalUsername = usernameRef.current.input.value;
      const modalPassword = passwordRef.current.input.value;
      const modalCheckPassword = checkPasswordRef.current.input.value;

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
            setOpen(0);
        }
      }
    }

    // 編輯個人資料
    else if (open === 3) {
      const modalPassword = passwordRef.current.input.value;
      const modalCheckPassword = checkPasswordRef.current.input.value;
      const modalNewPassword = newPasswordRef.current.input.value;
      const modalAvatar = avatarRef.current.input.value;
      const modalBio = bioRef.current.input.value;

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
          setOpen(0);
      }
    }

    // 刪除帳號
    else if (open === 4) {
      const modalPassword = passwordRef.current.input.value;
      
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
          setOpen(0);
      }
    }
  }

  const signInModal = <>
    <Input ref={usernameRef} placeholder="輸入你的帳號" prefix={<UserOutlined />} />
    <br/>
    <br/>
    <Input.Password ref={passwordRef} placeholder="輸入你的密碼"  />
    <br/>
  </>;
  
  const signUpModal = <>
    <Input ref={usernameRef} placeholder="輸入你的帳號" prefix={<UserOutlined />} />
    <br/>
    <br/>
    <Input.Password ref={passwordRef} placeholder="輸入你的密碼" />
    <br/>
    <br/>
    <Input.Password ref={checkPasswordRef} placeholder="確認你的密碼" />
  </>;

  const modifyModal = <>
    <Input.Password ref={passwordRef} placeholder="輸入你的原密碼" />
    <br/>
    <br/>
    <Input.Password ref={newPasswordRef} placeholder="輸入你的新密碼" />
    <br/>
    <br/>
    <Input.Password ref={checkPasswordRef} placeholder="確認你的密碼" />
    <br/>
    <br/>
    <Input ref={avatarRef} placeholder="輸入你的新頭像" />
    <br/>
    <br/>
    <Input.TextArea ref={bioRef} placeholder="輸入你的自介" rows={4} />
  </>;

  const deleteModal = <>
    <span>請輸入你的密碼以確認將此帳號刪除，注意此動作無法被復原</span>
    <br/>
    <br/>
    <Input.Password ref={passwordRef} placeholder="輸入你的密碼" />
  </>;

  return (
    <Modal
      title={["登入","註冊", "編輯個人資料"][open - 1]}
      centered
      open={(open > 0)}
      onOk={() => handleOk()}
      onCancel={() => setOpen(0)}
    >
      {[signInModal, signUpModal, modifyModal, deleteModal][open - 1]}
    </Modal>
  );
};

export default Modal_Components;