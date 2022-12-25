import Axis from "../../../utils/Axis";
import Vector3 from "../../../utils/Vector3";
import Block from "./Block";

class RedStoneTorch extends Block {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 101, needSupport: true, transparent: true, redstoneAutoConnect: true });

    this.states = { lit: true, facing: null };
  }

  get power() {
    return this.states.lit ? 15 : 0;
  }

  _xAngle = 0;
  _zAngle = 0;
  setFacing(dir) {
    switch (dir) {
      case Axis.PX: 
        this.states.facing = 'east';
        this._zAngle = -Math.PI / 6;
        break;

      case Axis.NX:
        this.states.facing = 'west';
        this._zAngle = Math.PI / 6;
        break;

      case Axis.PZ:
        this.states.facing = 'south';
        this._xAngle = Math.PI / 6;
        break;

      case Axis.NZ:
        this.states.facing = 'north';
        this._xAngle = -Math.PI / 6;
        break;

      default:
        this.states.facing = null;
        break;
    }
  }

  /**
   * 取得此方塊所有平面的資訊
   * @returns {import("../Playground").Surface[]}
   */
  surfaces() {
    return [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].map(dir => {
      return { points: this._surfaceOf(dir), color: this.surfaceColor(dir), dir, xAngle: this._xAngle, zAngle: this._zAngle, cords: new Vector3(this.x, this.y, this.z) };
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

  _interactionBoxVertices = [
    [this.x + 0.375, this.y       , this.z + 0.375], 
    [this.x + 0.625, this.y       , this.z + 0.375], 
    [this.x + 0.375, this.y + 0.75, this.z + 0.375], 
    [this.x + 0.625, this.y + 0.75, this.z + 0.375], 
    [this.x + 0.375, this.y       , this.z + 0.625], 
    [this.x + 0.625, this.y       , this.z + 0.625], 
    [this.x + 0.375, this.y + 0.75, this.z + 0.625], 
    [this.x + 0.625, this.y + 0.75, this.z + 0.625]
  ];
  _interactionBoxSurfaces = {
    [Axis.PX]: [1, 3, 7, 5], 
    [Axis.PY]: [2, 3, 7, 6], 
    [Axis.PZ]: [4, 5, 7, 6], 
    [Axis.NX]: [0, 2, 6, 4], 
    [Axis.NY]: [0, 1, 5, 4], 
    [Axis.NZ]: [0, 1, 3, 2]
  };

  interactionSurfaces() {
    const result = [];

    [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].forEach(dir => {
      result.push({ points: this._interactionSurfaceOf(dir), dir, cords: new Vector3(this.x, this.y, this.z) });
    });

    return result.filter(r => !!r);
  }

  _interactionSurfaceOf(dir) {
    let offset = null;
    switch (this.states.facing) {
      case 'east':
        offset = new Vector3(-0.375, 0.125, 0);
        break;
      
      case 'west':
        offset = new Vector3(0.375, 0.125, 0);
        break;
      
      case 'south':
        offset = new Vector3(0, 0.125, -0.375);
        break;
      
      case 'north':
        offset = new Vector3(0, 0.125, 0.375);
        break;

      default: break;
    }
    if (!offset) offset = new Vector3(0, 0, 0);

    return this._interactionBoxSurfaces[dir].map(i => new Vector3(...this._interactionBoxVertices[i]).add(offset));
  }

  /**
   * 根據 Post Placement Update 的來源方向更新自身狀態
   * @abstract
   */
  PPUpdate() {
    switch (this.states.facing) {
      case 'east':
        if (!this.engine.block(this.x - 1, this.y, this.z)?.sideSupport) {
          this.engine.leftClick(this.x, this.y, this.z);
        }
        break;

      case 'west':
        if (!this.engine.block(this.x + 1, this.y, this.z)?.sideSupport) {
          this.engine.leftClick(this.x, this.y, this.z);
        }
        break;
      
      case 'south':
        if (!this.engine.block(this.x, this.y, this.z - 1)?.sideSupport) {
          this.engine.leftClick(this.x, this.y, this.z);
        }
        break;

      case 'north':
        if (!this.engine.block(this.x, this.y, this.z + 1)?.sideSupport) {
          this.engine.leftClick(this.x, this.y, this.z);
        }
        break;
      
      default:
        if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
          this.engine.leftClick(this.x, this.y, this.z);
        }
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
    let a = -1, b = -1;
    switch (this.states.facing) {
      case 'east':
        a = 0;
        b = 4;
        break;

      case 'west':
        a = 1;
        b = 5;
        break;

      case 'south':
        a = 0;
        b = 1;
        break;

      case 'north':
        a = 4;
        b = 5;
        break;
      
      default: break;
    }

    // 0.44 = sqrt(3) / 4
    if (a >= 0) this._vertices[a][1] += 0.44;
    if (b >= 0) this._vertices[b][1] += 0.44;
    const surfaces = this._surfaces[dir].map(i => new Vector3(...this._vertices[i]));
    if (a >= 0) this._vertices[a][1] = this.y;
    if (b >= 0) this._vertices[b][1] = this.y;

    const center = new Vector3(this.x + 0.5, this.y + 0.375, this.z + 0.5);

    // 0.42 = (5 + sqrt(3)) / 16
    switch (this.states.facing) {
      case 'east': 
        return surfaces.map(s => s.subtract(center).rotateZ(-Math.PI / 6).add(center).add(new Vector3(-0.42, 0.125, 0)));

      case 'west':
        return surfaces.map(s => s.subtract(center).rotateZ(Math.PI / 6).add(center).add(new Vector3(0.42, 0.125, 0)));

      case 'south':
        return surfaces.map(s => s.subtract(center).rotateX(Math.PI / 6).add(center).add(new Vector3(0, 0.125, -0.42)));

      case 'north':
        return surfaces.map(s => s.subtract(center).rotateX(-Math.PI / 6).add(center).add(new Vector3(0, 0.125, 0.42)));

      default:
        return surfaces;
    }
  }
}

export default RedStoneTorch;