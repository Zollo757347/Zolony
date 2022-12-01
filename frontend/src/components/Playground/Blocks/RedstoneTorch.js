import Axis from "../../../utils/Axis";
import Vector3 from "../../../utils/Vector3";
import Block from "./Block";

class RedStoneTorch extends Block {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 101, needBottomSupport: true, transparent: true, redstoneAutoConnect: true });

    this.active = true;
  }

  get power() {
    return this.active ? 15 : 0;
  }

  /**
   * 取得此方塊所有平面的資訊
   * @returns {import("../Playground").Surface[]}
   */
  surfaces() {
    return [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].map(dir => {
      return { points: this._surfaceOf(dir), color: this.surfaceColor(dir), dir, cords: new Vector3(this.x, this.y, this.z) };
    });
  }

  /**
 ` * 取得此方塊指定平面的顏色
    * @param {symbol} dir 指定平面的法向量方向
  ` * @returns {string}
  ` */
  surfaceColor(dir) {
    switch (dir) {
      case Axis.PX:
        return 'rgba(200, 100, 100)';

      case Axis.PY:
        return 'rgba(240, 120, 120)';

      case Axis.PZ:
        return 'rgba(160, 80, 80)';

      case Axis.NX:
        return 'rgba(180, 90, 90)';

      case Axis.NY:
        return 'rgba(140, 70, 70)';

      case Axis.NZ:
        return 'rgba(220, 110, 110)';

      default:
        throw new Error();
    }
  }

  /**
   * 根據 Post Placement Update 的來源方向更新自身狀態
   * @param {symbol} dir 
   * @abstract
   */
  PPUpdate(dir) {
    if (dir === Axis.NY && !this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
      this.engine.leftClick(this.x, this.y, this.z);
    }
  }

  
  /**
   *       y
   *       |
   *       2---3
   *     6---7 |
   *     | 0-|-1--x
   *     4---5
   *    /
   *   z
   */
   _vertices = [
    [this.x + 0.375, this.y       , this.z + 0.375], 
    [this.x + 0.625, this.y       , this.z + 0.375], 
    [this.x + 0.375, this.y + 0.75, this.z + 0.375], 
    [this.x + 0.625, this.y + 0.75, this.z + 0.375], 
    [this.x + 0.375, this.y       , this.z + 0.625], 
    [this.x + 0.625, this.y       , this.z + 0.625], 
    [this.x + 0.375, this.y + 0.75, this.z + 0.625], 
    [this.x + 0.625, this.y + 0.75, this.z + 0.625]
  ];
  _surfaces = {
    [Axis.PX]: [1, 3, 7, 5], 
    [Axis.PY]: [2, 3, 7, 6], 
    [Axis.PZ]: [4, 5, 7, 6], 
    [Axis.NX]: [0, 2, 6, 4], 
    [Axis.NY]: [0, 1, 5, 4], 
    [Axis.NZ]: [0, 1, 3, 2]
  };

  /**
   * 取得指定平面的有向頂點座標
   * @param {symbol} dir 指定平面的法向量方向
   * @returns {Vector3[]}
   * @private
   */
  _surfaceOf(dir) {
    return this._surfaces[dir].map(i => new Vector3(...this._vertices[i]));
  }
}

export default RedStoneTorch;