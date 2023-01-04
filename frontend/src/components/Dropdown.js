import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import './css/Dropdown.css'

const Dropdown_Components = ({ setPageToInfo, haveLoggedIn, setHaveLoggedIn, setOpenModal }) => {
    const items = [
        {
            key: '1',
            label: <div onClick={setPageToInfo}>Your Profile</div>,
            disabled: (!haveLoggedIn)
        },
        {
            key: '2',
            label: <div onClick={() => setOpenModal(1)}>Log in</div>,
            disabled: (haveLoggedIn)
        },
        {
            key: '3',
            label: <div onClick={() => setOpenModal(2)}>Sign up</div>,
            disabled: (haveLoggedIn)
        },
        {
            key: '4',
            danger: true,
            label: <div onClick={() => setHaveLoggedIn(false) }>Log out</div>,
            disabled: (!haveLoggedIn)
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