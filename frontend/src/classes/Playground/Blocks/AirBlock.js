import { BlockType } from "../BlockType";
import { Block } from "./Block";

/**
 * 代表一個空氣方塊
 */
class AirBlock extends Block {
  constructor(options) {
    super({ type: BlockType.AirBlock, transparent: true, ...options });
  }

  surfaces() {
    return [];
  }

  PPUpdate() {}
}

export { AirBlock };