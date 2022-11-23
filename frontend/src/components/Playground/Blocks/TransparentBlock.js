import Axis from "../../../utils/Axis";
import Vector3 from "../../../utils/Vector3";
import Block from "./Block";

/**
 * 代表一個不透明的單位方塊
 */
class TransparentBlock extends Block {
  constructor({ x, y, z }) {
    super({ x, y, z, type: 2 });
  }

  /**
   * 取得此方塊指定平面的資訊
   * @param {Vector3} norm 指定平面的單位法向量
   * @returns 
   */
  surface(norm) {
    const baseX = norm === Axis.PX ? this.x + 1 : this.x;
    const baseY = norm === Axis.PY ? this.y + 1 : this.y;
    const baseZ = norm === Axis.PZ ? this.z + 1 : this.z;

    const relativePoints = 
      norm === Axis.PX || norm === Axis.NX ? 
        [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] :
        norm === Axis.PY || norm === Axis.NY ? 
          [[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]] :
          [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]];

    return {
      points: relativePoints.map(([dx, dy, dz]) => new Vector3(baseX + dx, baseY + dy, baseZ + dz)), 
      color: this.surfaceColor(norm)
    };
  }

  /**
   * 取得此方塊指定平面的材質
   * @param {Vector3} norm 指定平面的單位法向量
   * @returns 
   */
  surfaceColor(norm) {
    switch (norm) {
      case Axis.PX:
        return 'rgba(240, 120, 120, 0.3)';

      case Axis.PY:
        return 'rgba(120, 240, 120, 0.3)';

      case Axis.PZ:
        return 'rgba(120, 120, 240, 0.3)';

      case Axis.NX:
        return 'rgba(120, 240, 240, 0.3)';

      case Axis.NY:
        return 'rgba(240, 120, 240, 0.3)';

      case Axis.NZ:
        return 'rgba(240, 240, 120, 0.3)';

      default:
        throw new Error();
    }
  }
}

export default TransparentBlock;