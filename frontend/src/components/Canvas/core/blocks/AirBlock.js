import { BlockType } from "../utils";
import Block from "./Block";

/**
 * 代表一個空氣方塊
 */
class AirBlock extends Block {
  constructor(options) {
    super({ type: BlockType.AirBlock, blockName: 'Air Block', transparent: true, ...options });
  }

  surfaces() {
    return [];
  }

  PPUpdate() {}
}

export default AirBlock;