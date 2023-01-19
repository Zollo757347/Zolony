import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Modal, message as Message } from 'antd';
import './css/Modal.css'
import { useHook } from '../hooks/useHook';

const { TextArea } = Input;  
const Modal_Components = ({ open, setOpen }) => {
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  
  const { login, createAccount, editProfile, setUsername, setPassword, setBio, setAvatar, username, password, bio, avatar } = useHook();

  const handleOk = async () => {
    // 登入
    if (open === 1) {
      if (!username) {
        Message.error({ content: '請輸入帳號名稱', duration: 1 });
        return;
      }
      if (!password) {
        Message.error({ content: '請輸入密碼', duration: 1 });
        return;
      }

      const { error } = await login(username, password);
      switch (error) {
        case 'loading': return;

        case 'connection':
          Message.error({ content: '資料庫連線失敗', duration: 1 });
          return;

        case 'error':
          Message.error({ content: '使用者資料存取失敗', duration: 1 });
          return;

        case 'username':
          Message.error({ content: '此帳號名稱不存在', duration: 1 });
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
      if (password !== checkPassword) {
        Message.error({ content: '兩組密碼不相同！', duration: 1 });
      }
      else {
        const data = await createAccount(username, password);

        if (data === 'error') {
          Message.error({ content: '發生了一些錯誤！', duration: 1 });
        }
        else if (data === 'exist') {
          Message.error({ content: '該帳號已經存在！', duration: 1 });
        }
        else {
          Message.success({ content: '成功建立帳號！', duration: 1 });
          setOpen(0);
        }
      }
      setCheckPassword('');
    }
    else {
      if (newPassword !== checkPassword) {
        Message.error({ content: '兩組新密碼不相同！', duration: 1 });
      }
      else {
        const data = await editProfile(username, password, {
          newPassword, 
          newBio: bio, 
          newAvatar: avatar
        });

        if (data === 'error') {
          Message.error({ content: '發生了一些錯誤！', duration: 1 });
        }
        else if (data === 'invalid') {
          Message.error({ content: '你輸入了錯誤的密碼！', duration: 1 });
        }
        else if (data === 'password') {
          Message.error({ content: '新密碼不能與舊密碼相同！', duration: 1 });
        }
        else {
          Message.success({ content: '自介更新成功！', duration: 1 });
          setOpen(0);
        }
      }
      setCheckPassword('');
      setNewPassword('');
    }
  }

  const signInModal = <>
    <Input required placeholder="輸入你的帳號" prefix={<UserOutlined />} onChange={e => setUsername(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的密碼" onChange={e => {setPassword(e.target.value)}}/>
    <br/>
  </>
  
  const signUpModal = <>
    <Input placeholder="輸入你的帳號" prefix={<UserOutlined />} onChange={e => setUsername(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的密碼" onChange={e => setPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="確認你的密碼" onChange={e => setCheckPassword(e.target.value)}/>
  </>

  const modifyModal = <>
    <Input.Password placeholder="輸入你的原密碼" onChange={e => setPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的新密碼" onChange={e => setNewPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="確認你的密碼" onChange={e => setCheckPassword(e.target.value)}/>
    <br/>
    <br/>
    <Input.Password placeholder="輸入你的新頭像" onChange={e => setAvatar(e.target.value)}/>
    <br/>
    <br/>
    <TextArea placeholder="輸入你的自介" rows={4} onChange={e => setBio(e.target.value)}/>
  </>

  return (
    <Modal
      title={["登入","註冊", "修改密碼/編輯個人資料"][open - 1]}
      centered
      open={(open > 0)}
      onOk={() => handleOk()}
      onCancel={() => setOpen(0)}
    >
      {[signInModal, signUpModal, modifyModal][open - 1]}
    </Modal>
  );
};

export default Modal_Components;