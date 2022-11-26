import Axis from "../../../utils/Axis";
import FullBlock from "./FullBlock";

/**
 * 代表一個不透明的單位方塊
 */
class GlassBlock extends FullBlock {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 2 });
  }

  /**
   * 取得此方塊指定平面的顏色
   * @returns 
   */
  surfaceColor(dir) {
    switch (dir) {
      case Axis.PX:
        return 'rgba(200, 200, 200, 0.5)';

      case Axis.PY:
        return 'rgba(240, 240, 240, 0.5)';

      case Axis.PZ:
        return 'rgba(160, 160, 160, 0.5)';

      case Axis.NX:
        return 'rgba(180, 180, 180, 0.5)';

      case Axis.NY:
        return 'rgba(140, 140, 140, 0.5)';

      case Axis.NZ:
        return 'rgba(220, 220, 220, 0.5)';

      default:
        throw new Error();
    }
  }

  update() {}
}

export default GlassBlock;