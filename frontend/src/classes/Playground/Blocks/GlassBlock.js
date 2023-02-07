import { BlockType } from "../BlockType";
import { FullBlock } from "./FullBlock";

/**
 * 代表一個玻璃方塊，即透明的單位方塊
 */
class GlassBlock extends FullBlock {
  constructor(options) {
    super({ type: BlockType.GlassBlock, blockName: 'Glass Block', transparent: true, ...options });
  }

  /**
   * 取得此方塊的顏色
   * @returns {[number, number, number, number]}
   */
  surfaceColor() {
    return [200, 200, 200, 0.5];
  }

  PPUpdate() {}
}

export { GlassBlock };