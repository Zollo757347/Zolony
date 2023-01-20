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
  const [xLen, setXLen] = useState('');
  const [yLen, setYLen] = useState('');
  const [zLen, setZLen] = useState('');

  const [cvs, setCvs] = useState(null);

  const { getMap, createMap, deleteUserMap, username, bio, maps, avatar } = useHook();

  useEffect(() => {
    setSelectItems(maps.map(name => ({ label: name, value: name })));
  }, [maps]);

  const closeModal = () => {
    setMapName('');
    setXLen('');
    setYLen('');
    setZLen('');
    setOpenMapModal(false);
  }

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

      case 'user':
        Message.error({ content: '此帳號名稱不存在', duration: 1 });
        return;

      case 'map':
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
    const { error, data } = await createMap(username, {
      xLen: parseInt(xLen), 
      yLen: parseInt(yLen), 
      zLen: parseInt(zLen), 
      mapName
    });
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.error({ content: '資料庫連線失敗', duration: 1 });
        return;

      case 'error':
        Message.error({ content: '地圖資料存取失敗', duration: 1 });
        return;

      case 'user':
        Message.error({ content: '此帳號不存在', duration: 1 });
        return;

      case 'map':
        Message.error({ content: '你已經有一張相同名稱的地圖了', duration: 1 });
        return;
      
      default: 
        Message.success({ content: `成功建立地圖 ${data.mapName}`, duration: 1 });
    }

    setCvs(null);
    await Utils.Sleep(1);
    setCvs(<Canvas canvaswidth={500} canvasheight={500} xlen={data.xLen} yLen={data.yLen} zLen={data.zLen} preloaddata={data} storable={true} />);

    closeModal();
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
  </>;

  const MapModal = <>
    <Input placeholder="輸入你的地圖名稱" value={mapName} prefix={<RightOutlined />} onChange={e => setMapName(e.target.value)}/>
    <br/>
    <br/>
    <span>輸入三軸的長度</span>
    <div id='Map-Modal-xyz-wrapper'>
      <Input placeholder="X 軸長" value={xLen} className='Map-Modal-xyz' onChange={e => setXLen(e.target.value)}/>
      <Input placeholder="Y 軸長" value={yLen} className='Map-Modal-xyz' onChange={e => setYLen(e.target.value)}/>
      <Input placeholder="Z 軸長" value={zLen} className='Map-Modal-xyz' onChange={e => setZLen(e.target.value)}/>
    </div>
  </>;

  return (
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
            建立地圖
          </Button>
        </div>
        <div id='Info-right-section'>
          {cvs ?? <></>}
        </div>
      </div>

      <Modal
        title="建立地圖"
        centered
        open={openMapModal}
        onOk={() => handleModalOk()}
        onCancel={() => closeModal()}
      >
        {MapModal}
      </Modal>
    </div>
  );
}

export default Info;