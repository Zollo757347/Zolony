import { BlockType } from "../utils";
import FullBlock from "./FullBlock";
import data from "../../../../assets/json/blocks/ironBlock.json";

/**
 * 代表一個混凝土方塊，即不透明的單位方塊
 */
class Concrete extends FullBlock {
  constructor(options) {
    super({ type: BlockType.Concrete, blockName: data.name, ...options });

    this.texture = data.texture;
  }
}

export default Concrete;