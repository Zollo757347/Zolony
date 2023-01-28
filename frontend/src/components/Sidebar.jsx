import { Link } from "react-router-dom";
import styled from "styled-components";

const Sidebar = ({ collapsed, setCollapsed, items }) => {
  items = [
    ['一切的開端．訊號', '/signal'],
    ['明與暗的旅程．訊號傳遞', '/transmit'],
    ['強棒接力．紅石中繼器', '/repeater'],
    ['顛倒是非．紅石火把', '/torch'],
    ['邏輯閘．非或與', 'notorand'],
    ['計算機的第一步．加法器', 'adder']
  ];

  return (
    <SidebarWrapper collapsed={collapsed}>
      <StyledSidebar>{
        items.map((item, i) =>
          <StyledLink key={i} to={item[1]}><StyledItem order={i}>{item[0]}</StyledItem></StyledLink>
        )
      }</StyledSidebar>
      <StyledGhostDiv onClick={() => setCollapsed(true)}></StyledGhostDiv>
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 20100;

  display: flex;
  justify-content: space-between;

  opacity: ${props => props.collapsed ? 0 : 1};
  ${props => props.collapsed ? "transform: translateY(-100%);" : ""};
  transition: transform 0.3s, opacity 0.3s ease-in;
`;

const StyledSidebar = styled.div`
  background-color: #FFF6A8;
  height: 100%;
  width: 20%;
`;

const StyledGhostDiv = styled.div`
  background-color: #888888;
  opacity: 0.1;
  height: 100%;
  width: 90%;
`;

const StyledItem = styled.div`
  padding: 10px;
  background-color: ${props => props.order & 1 ? "#FCDE71" : "#FFF78A"};
  border: 2px ${props => props.order & 1 ? "#FCDE71" : "#FFF78A"} solid;
  display: flex;
  align-items: center;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    background-color: #FFFDA1;
    border: 2px #EDEC97 solid;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #241F04;
`;

export default Sidebar;