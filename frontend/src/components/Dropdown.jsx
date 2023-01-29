import styled from 'styled-components';

const Dropdown = ({ collapsed, setCollapsed, items }) => {
  return (
    <DropdownWrapper collapsed={collapsed}>
      <StyledGhostDiv onClick={() => setCollapsed(true)}></StyledGhostDiv>
      <StyledDropdown>{
        items.map((item, i) =>
          <MenuItem key={i} order={i} onClick={item.todo}>{item.name}</MenuItem>
        )
      }</StyledDropdown>
    </DropdownWrapper>
  );
}

const DropdownWrapper = styled.div`
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

const StyledDropdown = styled.div`
  background-color: #FFF6A8;
  box-shadow: 0 0 5px rgba(130, 130, 130, 0.5);
  border-radius: 0 0 5px 5px;
  overflow: hidden;

  position: absolute;
  right: 0;
`;

const MenuItem = styled.div`
  padding: 10px;
  background-color: ${props => props.order & 1 ? "#FCDE71" : "#FFF78A"};
  border: 2px ${props => props.order & 1 ? "#FCDE71" : "#FFF78A"} solid;
  text-align: center;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    background-color: #FFFDA1;
    border: 2px #EDEC97 solid;
  }
`;

const StyledGhostDiv = styled.div`
  background-color: #888888;
  opacity: 0.1;
  height: 100%;
  width: 100%;

  position: fixed;
`;

export default Dropdown;