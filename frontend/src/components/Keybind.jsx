import styled from "styled-components";

/**
 * @typedef KeyTypes
 * @type {"break" | "interact" | "place" | "showEntities"}
 */

/**
 * @typedef KeybindParams
 * @type {object}
 * @property {KeyTypes} type
 * @property {string} content
 * @property {string} keybind
 */

/**
 * @param {KeybindParams} params 
 */
const Keybind = ({ type, content, keybind }) => {
  return (
    <KeybindWrapper>
      <StyledSpan>{content ?? contentTable[type]}</StyledSpan>
      <Tooltip>預設為{keybind ?? keybindTable[type]}</Tooltip>
    </KeybindWrapper>
  );
}

const contentTable = Object.freeze({
  break: '破壞', 
  interact: '互動', 
  place: '放置', 
  showEntities: '顯示實體'
});

const keybindTable = Object.freeze({
  break: '滑鼠左鍵', 
  interact: '滑鼠右鍵', 
  place: '滑鼠右鍵', 
  showEntities: ' F3 + G'
});

const KeybindWrapper = styled.span`
  position: relative;

  &:hover > span {
    display: inline;
  }
`;

const StyledSpan = styled.span`
  text-decoration: underline dotted;

  &:hover {
    cursor: help;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  display: none;
  width: 150px;
  bottom: 1.5em;
  left: 0;

  padding: 3px;
  text-align: center;

  background-color: rgb(193, 253, 186);
  border: 2px solid rgb(64, 240, 71);
  border-radius: 3px;

  &:hover {
    display: inline;
  }
`;

export default Keybind;