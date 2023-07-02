import styled from "styled-components";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterTitle>相關連結</FooterTitle>
      <FooterContent>
        <FooterItem href="https://github.com/Zollo757347/Zolony">網站原始碼</FooterItem>
        <FooterItem href="https://minecraft.fandom.com/zh/wiki/Minecraft_Wiki">中文 Minecraft Wiki</FooterItem>
      </FooterContent>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.div`
  background-color: #F1D025;
  width: 60%;
  padding: 50px 15px 50px 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterTitle = styled.div`
  color: white;
  font-size: 2em;
  font-weight: bold;
  margin: 10px;
  padding: 5px 20px;
  border-bottom: 1px solid white;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterItem = styled.a`
  color: white;
  font-size: 1.1em;
  margin: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

export default Footer;