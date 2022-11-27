import Axis from "../../../utils/Axis";
import FullBlock from "./FullBlock";

/**
 * 代表一個混凝土方塊，或不透明的單位方塊
 */
class Concrete extends FullBlock {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 1 });
  }

  /**
   * 取得此方塊指定平面的顏色
   * @param {symbol} dir 指定平面的法向量方向
   * @returns {string}
   */
  surfaceColor(dir) {
    switch (dir) {
      case Axis.PX:
        return 'rgba(200, 200, 200)';

      case Axis.PY:
        return 'rgba(240, 240, 240)';

      case Axis.PZ:
        return 'rgba(160, 160, 160)';

      case Axis.NX:
        return 'rgba(180, 180, 180)';

      case Axis.NY:
        return 'rgba(140, 140, 140)';

      case Axis.NZ:
        return 'rgba(220, 220, 220)';

      default:
        throw new Error();
    }
  }

  update() {}
}

export default Concrete;