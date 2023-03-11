import { parseTexture } from "../../../components/Canvas/core/utils";
import _block from "./block.json";
import _cube from "./cube.json";
import _cube_all from "./cube_all.json";
import _glass from "./glass.json";
import _iron_block from "./iron_block.json";
import _redstone_lamp from "./redstone_lamp.json";
import _redstone_lamp_on from "./redstone_lamp_on.json";

const _blockData = {
  block: _block,
  cube: _cube, 
  cube_all: _cube_all, 
  glass: _glass, 
  iron_block: _iron_block, 
  redstone_lamp: _redstone_lamp, 
  redstone_lamp_on: _redstone_lamp_on
};

export const glass = parseTexture(_blockData, 'glass');
export const iron_block = parseTexture(_blockData, 'iron_block');
export const redstone_lamp = parseTexture(_blockData, 'redstone_lamp');
export const redstone_lamp_on = parseTexture(_blockData, 'redstone_lamp_on');