import styled from "styled-components";
import { ButtonTexture } from "../classes/ButtonTexture";

const Button = styled.button`
  background-color: ${props => props.disabled ? 'transparent' : getBackgroundColor(props.texture)};
  color: ${props => props.disabled ? getTextColor(props.texture) : 'white'};
  padding: 8px;
  margin: 5px;
  border: 2px ${props => getBorderColor(props.texture)} solid;
  border-radius: 0.5em; 
  transition-duration: 300ms;

  &:hover {
    background-color: ${props => getBorderColor(props.texture)};
    color: white;
    cursor: pointer;
    border: 2px ${props => getHoverBorderColor(props.texture)} solid;
  }

  &:active {
    background-color: ${props => getActiveBackgroundColor(props.texture)};
    cursor: pointer;
  }

  &:disabled {
    background-color: ${props => props.disabled ? 'transparent' : getBackgroundColor(props.texture)};
    color: ${props => props.disabled ? getTextColor(props.texture) : 'white'};
    cursor: not-allowed;
  }
`;

const backgroundColors = Object.freeze({
  [ButtonTexture.Primary]: '#FFA300', 
  [ButtonTexture.Secondary]: '#888888', 
  [ButtonTexture.Success]: '#41F841', 
  [ButtonTexture.Danger]: '#F84141', 
});
function getBackgroundColor(texture) {
  return backgroundColors[texture] ?? backgroundColors[ButtonTexture.Primary];
}

const textColors = Object.freeze({
  [ButtonTexture.Primary]: '#654300', 
  [ButtonTexture.Secondary]: '#333333', 
  [ButtonTexture.Success]: '#246524', 
  [ButtonTexture.Danger]: '#652424', 
});
function getTextColor(texture) {
  return textColors[texture] ?? textColors[ButtonTexture.Primary];
}

const borderColors = Object.freeze({
  [ButtonTexture.Primary]: '#FFC350', 
  [ButtonTexture.Secondary]: '#AAAAAA', 
  [ButtonTexture.Success]: '#61FF61', 
  [ButtonTexture.Danger]: '#FF6161', 
});
function getBorderColor(texture) {
  return borderColors[texture] ?? borderColors[ButtonTexture.Primary];
}

const hoverBorderColors = Object.freeze({
  [ButtonTexture.Primary]: '#FFD380', 
  [ButtonTexture.Secondary]: '#BBBBBB', 
  [ButtonTexture.Success]: '#71FF71', 
  [ButtonTexture.Danger]: '#FF7171', 
});
function getHoverBorderColor(texture) {
  return hoverBorderColors[texture] ?? hoverBorderColors[ButtonTexture.Primary];
}

const activeBackgroundColors = Object.freeze({
  [ButtonTexture.Primary]: '#FFB320', 
  [ButtonTexture.Secondary]: '#999999', 
  [ButtonTexture.Success]: '#51EE51', 
  [ButtonTexture.Danger]: '#EE5151', 
});
function getActiveBackgroundColor(texture) {
  return activeBackgroundColors[texture] ?? activeBackgroundColors[ButtonTexture.Primary];
}

export default Button;