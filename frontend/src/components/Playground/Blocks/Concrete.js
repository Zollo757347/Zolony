import Axis from "../../../utils/Axis";
import Vector3 from "../../../utils/Vector3";
import FullBlock from "./FullBlock";

/**
 * 代表一個不透明的單位方塊
 */
class Concrete extends FullBlock {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 1 });
  }

  /**
   * 取得此方塊指定平面的資訊
   * @returns 
   */
  surfaces() {
    const result = [];

    [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].forEach(dir => {
      const norm = Axis.VECTOR[dir];
      const x = this.x + norm.x, y = this.y + norm.y, z = this.z + norm.z;
      const block = this.engine.block(x, y, z);
      if (block?.type === 1) return undefined;
      
      result.push({ points: this._surfaceOf(dir), color: this.surfaceColor(dir), norm: dir, cords: new Vector3(this.x, this.y, this.z) });
    });

    return result.filter(r => !!r);
  }

  /**
   * 取得此方塊指定平面的顏色
   * @returns 
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