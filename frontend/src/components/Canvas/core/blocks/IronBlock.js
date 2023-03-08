import { BlockType } from "../utils";
import FullBlock from "./FullBlock";
import data from "../../../../assets/json/blocks/ironBlock.json";

/**
 * 代表一個混凝土方塊，即不透明的單位方塊
 */
class IronBlock extends FullBlock {
  constructor(options) {
    super({ type: BlockType.IronBlock, blockName: data.name, ...options });

    this.outline = data.outline;
    this.texture = data.texture;
  }
}

export default IronBlock;