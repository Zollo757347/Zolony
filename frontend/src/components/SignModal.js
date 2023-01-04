import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import './css/SignModal.css'

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

    return (
        <Modal
            title={["登入","註冊"][open - 1]}
            centered
            open={(open > 0)}
            onOk={() => {setOpen(false); setHaveLoggedIn(true)}}
            onCancel={() => setOpen(false)}
        >
            {open === 1? signInModal : signUpModal}
        </Modal>
    );
};

export default Modal_Components;