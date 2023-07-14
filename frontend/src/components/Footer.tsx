import "../styles/footer.css";

const Footer = () => {
  return (
    <div className="z-footer-wrapper">
      <div className="z-footer-title">相關連結</div>
      <div className="z-footer-content">
        <a className="z-footer-item" href="https://github.com/Zollo757347/Zolony">網站原始碼</a>
        <a className="z-footer-item" href="https://minecraft.fandom.com/zh/wiki/Minecraft_Wiki">中文 Minecraft Wiki</a>
      </div>
    </div>
  );
}
export default Footer;