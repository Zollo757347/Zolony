import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const dropdown = ({ haveLoggedIn, setOpenModal }) => {
    const items = [
        {
            key: '1',
            label: 'Your profile',
            disabled: (!haveLoggedIn)
        },
        {
            key: '2',
            label: <div onClick={() => setOpenModal(1)}>Sign in</div>,
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
            label: 'Sign out',
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
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <b>Account</b>
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    )
}

export default dropdown;

/*<Button type="primary" onClick={() => setOpen(true)}>
        Open Modal of 1000px width
      </Button> */