import { useEffect, useState } from 'react';
import { Form, Input, Avatar, Image, Select, Modal, message as Message } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './css/Info.css';
import { useHook } from '../hooks/useHook';
import { ButtonTexture } from '../classes/ButtonTexture';
import Utils from '../classes/Utils';
import Button from '../components/Button';
import Canvas from '../components/Canvas';

const Info = ({ setOpenModal }) => {
  const [selectItems, setSelectItems] = useState([]);
  const [openMapModal, setOpenMapModal] = useState(false);

  const [mapName, setMapName] = useState('');
  const [xLen, setXLen] = useState(0);
  const [yLen, setYLen] = useState(0);
  const [zLen, setZLen] = useState(0);

  const [cvs, setCvs] = useState(null);

  const { getMap, initialMyMap, deleteUserMap, username, bio, maps, avatar } = useHook();

  useEffect(() => {
    setSelectItems(maps.map(name => ({ label: name, value: name })));
  }, [maps]);

  const onSelect = async (mapName) => {
    const { error, data } = await getMap(username, mapName);
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.error({ content: '資料庫連線失敗', duration: 1 });
        return;

      case 'error':
        Message.error({ content: '地圖資料存取失敗', duration: 1 });
        return;

      case 'username':
        Message.error({ content: '此帳號名稱不存在', duration: 1 });
        return;

      case 'mapName':
        Message.error({ content: '你並沒有這張地圖', duration: 1 });
        return;
      
      default: break;
    }

    Message.success({ content: `成功開啟 ${mapName}`, duration: 1 });
    setCvs(null);
    await Utils.Sleep(1);
    setCvs(<Canvas canvaswidth={500} canvasheight={500} xlen={data.xLen} yLen={data.yLen} zLen={data.zLen} preloaddata={data} storable={true} />);
  }

  const handleModalOk = async () => {
    const data = await initialMyMap(username, parseInt(xLen), parseInt(yLen), parseInt(zLen), mapName);

    setCvs(null);
    await Utils.Sleep(1);
    setCvs(<Canvas canvaswidth={500} canvasheight={500} xlen={data.xLen} yLen={data.yLen} zLen={data.zLen} preloaddata={data} storable={true} />);
    setOpenMapModal(false);
  }

  const handleMapDelete = async () => {
    await deleteUserMap(username, mapName);
    setCvs(null);
  }

  const profileForm = <>
    <Form>
      <div id='Info-username' className='Info-left'>
        <Form.Item label="Username">
          <Input defaultValue={username} disabled={true}/>
        </Form.Item>
      </div>
      <div id='Info-avatar' className='Info-left'>
        <Avatar
          src={<Image src={avatar}/>}
          style={{
            width: 400,
            height: 400,
          }}
        />
      </div>
      <div id='Info-bio' className='Info-left'>
        <Form.Item label="Bio">{bio}</Form.Item>
      </div>
      <div id='Info-btn'>
        <Form.Item>
          <Button texture={ButtonTexture.Primary} onClick={() => setOpenModal(3)}>
            編輯個人資料
          </Button>
        </Form.Item>
        <Form.Item>
          <Button texture={ButtonTexture.Danger} onClick={() => setOpenModal(4)}>
            刪除帳號
          </Button>
        </Form.Item>
      </div>
    </Form>
  </>

  const MapModal = <>
    <Input placeholder="輸入你的地圖名稱" prefix={<RightOutlined />} onChange={e => setMapName(e.target.value)}/>
    <br/>
    <br/>
    <span> 輸入長寬高↓ </span>
    <div id='Map-Modal-xyz-wrapper'>
      <Input placeholder="xlen" className='Map-Modal-xyz' onChange={e => setXLen(e.target.value)}/>
      <Input placeholder="ylen" className='Map-Modal-xyz' onChange={e => setYLen(e.target.value)}/>
      <Input placeholder="zlen" className='Map-Modal-xyz' onChange={e => setZLen(e.target.value)}/>
    </div>
  </>

  return(
    <div id='Info-wrapper'>
      <div id='Info-left-wrapper'>
        {profileForm}
      </div>
      <div id='Info-right-wrapper'>
        <div id='Info-right-header'>
          <div id='Info-select' width="100px">
            <Form><Form.Item><Select
              showSearch
              placeholder="請選擇一張地圖"
              optionFilterProp="children"
              onSelect={onSelect}
              onChange={onSelect}
              style = {{
                width: '100%'
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={selectItems}
            /></Form.Item></Form>
          </div>
          <Button texture={ButtonTexture.Danger} onClick={handleMapDelete} disabled={!cvs}>
            刪除地圖
          </Button>
          <Button texture={ButtonTexture.Success} onClick={() => setOpenMapModal(true)}> 
            增加地圖
          </Button>
        </div>
        <div id='Info-right-section'>
            {cvs ?? <></>}
        </div>
      </div>

      <Modal
        title="新增地圖"
        centered
        open={openMapModal}
        onOk={() => handleModalOk()}
        onCancel={() => setOpenMapModal(false)}
      >
        {MapModal}
      </Modal>
    </div>
  );
}

export default Info;