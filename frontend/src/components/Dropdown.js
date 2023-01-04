import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import './css/Dropdown.css'
import { UseHook } from '../hook/usehook';

const Dropdown_Components = ({ setPageToInfo, haveLoggedIn, setHaveLoggedIn, setOpenModal}) => {
    const { isLogIn , LogOut} = UseHook();
    const items = [
        {
            key: '1',
            label: <div onClick={setPageToInfo}>Your Profile</div>,
            disabled: (!isLogIn)
        },
        {
            key: '2',
            label: <div onClick={() => setOpenModal(1)}>Log in</div>,
            disabled: (isLogIn)
        },
        {
            key: '3',
            label: <div onClick={() => setOpenModal(2)}>Sign up</div>,
            disabled: (isLogIn)
        },
        {
            key: '4',
            danger: true,
            label: <div onClick={() => LogOut() }>Log out</div>,
            disabled: (!isLogIn)
        }
    ];

    return(
        <Dropdown
            menu={{
                items
            }}
            trigger={['click']}
            id="dropdown"
        >
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <b>Account</b>
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    )
}

export default Dropdown_Components;