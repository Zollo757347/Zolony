import { BlockType } from "../utils";
import FullBlock from "./FullBlock";
import { glass } from "../../../../assets/json/blocks";

/**
 * 代表一個玻璃方塊，即透明的單位方塊
 */
class GlassBlock extends FullBlock {
  constructor(options) {
    super({ type: BlockType.GlassBlock, blockName: '玻璃', transparent: true, ...options });

    this.outlines = glass.outlines;
    this.textures = glass.textures;
  }

  PPUpdate() {}
}

export default GlassBlock;