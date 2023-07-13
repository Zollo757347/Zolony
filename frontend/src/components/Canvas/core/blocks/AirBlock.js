import { BlockType } from "../utils";
import Block from "./Block";

/**
 * 代表一個空氣方塊
 */
class AirBlock extends Block {
  constructor(options) {
    super({ type: BlockType.AirBlock, blockName: '空氣', transparent: true, ...options });
  }

  PPUpdate() {}
}

export default AirBlock;