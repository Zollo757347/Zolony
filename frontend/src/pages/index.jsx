import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="main-page" style={{ display: 'flex', marginTop: 60, flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '2em', textAlign: 'center' }}>Minecraft 紅石教學網</div>
      <img src={require("../assets/pictures/sidebar/wordmark.png")} alt="Logo" width="70%" />
      <div style={{ fontSize: '2em', textAlign: 'center' }}><Link to="/general">入口</Link></div>
    </div>
  );
}

export default MainPage;