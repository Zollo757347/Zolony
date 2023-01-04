import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import './css/SignModal.css'
import { UseHook } from '../hook/usehook';



const Modal_Components = ({open, setOpen}) => {
    const [inputError, setInputError] = useState(0);
    const { LogIn, CreateAccount} = UseHook();

    let userKey, passwordKey, checkPasswordKey;

    const ClickOk = async () => {
        if(open === 1){ //signin
            const data = await LogIn(userKey, passwordKey);
                console.log(data)
            if(data === 'user not found') setInputError(1);
            else{
                setOpen(false);
            }
        }
        else{  //signup
            if(passwordKey !== checkPasswordKey){
                setInputError(1);
            }
            else {
                const data = await CreateAccount(userKey, passwordKey);
                console.log("SignModal", data);
                if(data === '') setInputError(2);
                else{
                    setOpen(false);
                }
            }
        }
    }

    const signInModal = <>
        {inputError === 1 ? <p style={{color: 'red'}}>帳號或密碼輸入錯誤</p> : <></>}
        <Input placeholder="輸入你的帳號" prefix={<UserOutlined />} onChange={e => {userKey = e.target.value}}/>
        <br/>
        <br/>
        <Input.Password placeholder="輸入你的密碼" onChange={e => {passwordKey = e.target.value}}/>
        <br/>
    </>
    
    const signUpModal = <>
        {inputError === 2 ? <p style={{color: 'red'}}>名稱已被使用</p> : inputError === 1 ? <p style={{color: 'red'}}>密碼與驗證碼不符</p> : <></>}
        <Input placeholder="輸入你的帳號" prefix={<UserOutlined />} onChange={e => {userKey = e.target.value}}/>
        <br/>
        <br/>
        <Input.Password placeholder="輸入你的密碼" onChange={e => {passwordKey = e.target.value}}/>
        <br/>
        <br/>
        <Input.Password placeholder="確認你的密碼" onChange={e => {checkPasswordKey = e.target.value}}/>
    </>

    return (
        <Modal
            title={["登入","註冊"][open - 1]}
            centered
            open={(open > 0)}
            onOk={async () => ClickOk()}
            onCancel={() => setOpen(false)}
        >
            {open === 1? signInModal : signUpModal}
        </Modal>
    );
};

export default Modal_Components;