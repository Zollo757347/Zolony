import { BlockType } from "../utils";
import FullBlock from "./FullBlock";
import { iron_block } from "../../../../assets/json/blocks";

/**
 * 代表一個混凝土方塊，即不透明的單位方塊
 */
class IronBlock extends FullBlock {
  constructor(options) {
    super({ type: BlockType.IronBlock, blockName: '鐵方塊', ...options });

    this.outline = iron_block.map(({outline}) => outline);
    this.texture = iron_block.map(({texture}) => texture);
  }
}

export default IronBlock;