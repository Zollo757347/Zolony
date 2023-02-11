const MainPage = () => {
  return (
    <div className="main-page" style={{ display: 'flex', marginTop: 60, flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '2em', textAlign: 'center' }}>Minecraft 紅石教學網</div>
      <img src={require("../assets/pictures/header/wordmark.png")} alt="Logo" width="70%" />
      <div style={{ fontSize: '2em', textAlign: 'center' }}>工程師不知道怎麼設計首頁<br />所以就不設計了</div>
    </div>
  );
}

export default MainPage;