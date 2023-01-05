import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import './css/Dropdown.css'
import { UseHook } from '../hook/usehook';

const Dropdown_Components = ({ setPageToInfo, setOpenModal}) => {
    const { isLogIn , LogOut, setPageNum } = UseHook();
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
            label: <div onClick={() => {LogOut(); setPageNum(1);}}>Log out</div>,
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
            <span onClick={(e) => e.preventDefault()}>
                <Space>
                    <b>Account</b>
                    <DownOutlined />
                </Space>
            </span>
        </Dropdown>
    )
}

export default Dropdown_Components;