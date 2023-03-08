import { BlockType } from "../utils";
import FullBlock from "./FullBlock";
import data from "../../../../assets/json/blocks/glassBlock.json";

/**
 * 代表一個玻璃方塊，即透明的單位方塊
 */
class GlassBlock extends FullBlock {
  constructor(options) {
    super({ type: BlockType.GlassBlock, blockName: data.name, transparent: true, ...options });

    this.outline = data.outline;
    this.texture = data.texture;
  }

  PPUpdate() {}
}

export default GlassBlock;