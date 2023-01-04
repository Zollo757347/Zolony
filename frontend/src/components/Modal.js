import React, { useState } from 'react';
import { UserOutlined, RightOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import './css/Modal.css'

const { TextArea } = Input;
const Modal_Components = ({open, setOpen, setHaveLoggedIn}) => {
    const [inputError, setInputError] = useState(0);

    const signInModal = <>
        {inputError ? <p>error message...</p> : <></>}
        <Input placeholder="輸入你的帳號" prefix={<UserOutlined />} onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <Input.Password placeholder="輸入你的密碼" onChange={e => console.log(e.target.value)}/>
        <br/>
    </>
    
    const signUpModal = <>
        {inputError ? <p>error message...</p> : <></>}
        <Input placeholder="輸入你的帳號" prefix={<UserOutlined />} onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <Input.Password placeholder="輸入你的密碼" onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <Input.Password placeholder="確認你的密碼" onChange={e => console.log(e.target.value)}/>
    </>

    const modifyModal = <>
        {inputError ? <p>error message...</p> : <></>}
        <Input.Password placeholder="輸入你的原密碼" onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <Input.Password placeholder="輸入你的新密碼" onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <Input.Password placeholder="確認你的密碼" onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <Input placeholder="輸入你的頭像網址" prefix={<RightOutlined />} onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <TextArea placeholder="輸入你的自介" rows={4} onChange={e => console.log(e.target.value)}/>
    </>

    return (
        <Modal
            title={["登入","註冊", "修改密碼/編輯個人資料"][open - 1]}
            centered
            open={(open > 0)}
            onOk={() => {setOpen(false); setHaveLoggedIn(true)}}
            onCancel={() => setOpen(false)}
        >
            {[signInModal, signUpModal, modifyModal][open - 1]}
        </Modal>
    );
};

export default Modal_Components;