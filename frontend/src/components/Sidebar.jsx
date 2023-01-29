import { Link } from "react-router-dom";
import styled from "styled-components";

const Sidebar = ({ collapsed, setCollapsed, items }) => {
  return (
    <SidebarWrapper collapsed={collapsed}>
      <StyledGhostDiv onClick={() => setCollapsed(true)}></StyledGhostDiv>
      <StyledSidebar>{
        items.map((item, i) =>
          <StyledLink key={i} to={item.path}><StyledItem order={i}>{item.name}</StyledItem></StyledLink>
        )
      }</StyledSidebar>
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
  box-shadow: 5px 0 10px rgba(130, 130, 130, 0.3);

  position: absolute;
  left: 0;
`;

const StyledGhostDiv = styled.div`
  background-color: #888888;
  opacity: 0.1;
  height: 100%;
  width: 100%;

  position: fixed;
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