import { BlockType } from "../utils";
import FullBlock from "./FullBlock";
import { glass } from "../../../../assets/json/blocks";

/**
 * 代表一個玻璃方塊，即透明的單位方塊
 */
class GlassBlock extends FullBlock {
  constructor(options) {
    super({ type: BlockType.GlassBlock, blockName: '玻璃', transparent: true, ...options });

    this.outline = glass.map(({outline}) => outline);
    this.texture = glass.map(({texture}) => texture);
  }

  PPUpdate() {}
}

export default GlassBlock;