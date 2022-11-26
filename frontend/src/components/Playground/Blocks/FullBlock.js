import Axis from "../../../utils/Axis";
import Vector3 from "../../../utils/Vector3";
import Block from "./Block";

/**
 * 代表一個不透明的單位方塊
 * @abstract
 */
class FullBlock extends Block {
  constructor(options) {
    super({ 
      fullSupport: true, 
      ...options
    });
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
    throw new Error('Not implemented yet.');
  }

  /**
   *       y
   *       |
   *       2------3
   *      /|     /|
   *     6------7 |
   *     | 0----|-1--x
   *     |/     |/
   *     4------5
   *    /
   *   z
   */
  _vertices = [
    [this.x    , this.y    , this.z], 
    [this.x + 1, this.y    , this.z], 
    [this.x    , this.y + 1, this.z], 
    [this.x + 1, this.y + 1, this.z], 
    [this.x    , this.y    , this.z + 1], 
    [this.x + 1, this.y    , this.z + 1], 
    [this.x    , this.y + 1, this.z + 1], 
    [this.x + 1, this.y + 1, this.z + 1]
  ];
  _surfaces = {
    [Axis.PX]: [1, 3, 7, 5], 
    [Axis.PY]: [2, 3, 7, 6], 
    [Axis.PZ]: [4, 5, 7, 6], 
    [Axis.NX]: [0, 2, 6, 4], 
    [Axis.NY]: [0, 1, 5, 4], 
    [Axis.NZ]: [0, 1, 3, 2]
  };
  _surfaceOf(dir) {
    return this._surfaces[dir].map(i => new Vector3(...this._vertices[i]));
  }
}

export default FullBlock;