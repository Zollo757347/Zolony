import { BlockType } from "../BlockType";
import { FullBlock } from "./FullBlock";

/**
 * 代表一個混凝土方塊，即不透明的單位方塊
 */
class Concrete extends FullBlock {
  constructor(options) {
    super({ type: BlockType.Concrete, blockName: 'Concrete', ...options });
  }

  /**
   * 取得此方塊的顏色
   * @returns {[number, number, number]}
   */
  surfaceColor() {
    return [200, 200, 200];
  }
}

export { Concrete };