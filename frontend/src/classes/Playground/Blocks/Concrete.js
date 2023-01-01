import Axis from "../../Axis";
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
   * 取得此方塊指定平面的顏色
   * @param {symbol} dir 指定平面的法向量方向
   * @returns {string}
   */
  surfaceColor(dir) {
    switch (dir) {
      case Axis.PX:
        return 'rgb(200, 200, 200)';

      case Axis.PY:
        return 'rgb(240, 240, 240)';

      case Axis.PZ:
        return 'rgb(160, 160, 160)';

      case Axis.NX:
        return 'rgb(180, 180, 180)';

      case Axis.NY:
        return 'rgb(140, 140, 140)';

      case Axis.NZ:
        return 'rgb(220, 220, 220)';

      default:
        throw new Error();
    }
  }
}

export { Concrete };