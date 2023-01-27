import styled from "styled-components";
import { useHook } from '../hooks/useHook';

const Sidebar = ({ collapsed, setCollapsed, items }) => {
  const { setPageNum } = useHook();

  items = [
    ['一切的開端．訊號', 2],
    ['明與暗的旅程．訊號傳遞', 3],
    ['強棒接力．紅石中繼器', 4],
    ['顛倒是非．紅石火把', 5],
    ['邏輯閘．非或與', 6],
    ['計算機的第一步．加法器', 7]
  ];

  function handleItemClick(e) {
    const page = e.target.getAttribute('order');
    setPageNum(page);
  }

  function handleShadowClick() {
    setCollapsed(true);
  }

  return (
    <StyledSidebarWrapper collapsed={collapsed}>
      <StyledSidebar>{
        items.map(item =>
          <StyledItem key={item[1]} order={item[1]} onClick={handleItemClick}>{item[0]}</StyledItem>
        )
      }</StyledSidebar>
      <StyledGhostDiv onClick={handleShadowClick}></StyledGhostDiv>
    </StyledSidebarWrapper>
  );
}

const StyledSidebarWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 2010;

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

export default Sidebar;