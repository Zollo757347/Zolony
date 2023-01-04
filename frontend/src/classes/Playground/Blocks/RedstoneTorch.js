import Axis from "../../Axis";
import Vector3 from "../../Vector3";
import { BlockType } from "../BlockType";
import { Block } from "./Block";

/**
 * @typedef _RedstoneTorchStates
 * @type {object}
 * @property {boolean} lit 此紅石火把是否被觸發
 * @property {'north' | 'south' | 'west' | 'east' | 'up'} facing 此紅石火把面向的方向
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneTorchStates} RedstoneTorchStates
 */

class RedstoneTorch extends Block {
  constructor(options) {
    super({ type: BlockType.RedstoneTorch, blockName: 'Redstone Torch', needSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    /**
     * 此紅石火把的狀態
     * @type {RedstoneTorchStates}
     */
    this.states = { ...(this.states ?? {}), lit: true, facing: 'up', source: true };
  }

  get power() {
    return this.states.lit ? 15 : 0;
  }

  _xAngle = 0;
  _zAngle = 0;

  /**
   * 設定紅石火把面向的方向
   * @param {symbol} normDir 指定面的法向量方向
   * @param {symbol} facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir, facingDir) {
    switch (normDir) {
      case Axis.PX: 
        this.states.facing = 'east';
        this._xAngle = 0;
        this._zAngle = -Math.PI / 6;
        break;

      case Axis.NX:
        this.states.facing = 'west';
        this._xAngle = 0;
        this._zAngle = Math.PI / 6;
        break;

      case Axis.PZ:
        this.states.facing = 'south';
        this._xAngle = Math.PI / 6;
        this._zAngle = 0;
        break;

      case Axis.NZ:
        this.states.facing = 'north';
        this._xAngle = -Math.PI / 6;
        this._zAngle = 0;
        break;

      default:
        this.states.facing = 'up';
        this._xAngle = 0;
        this._zAngle = 0;
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
    if (!this.states.lit) return 'black';

    switch (dir) {
      case Axis.PX:
        return 'rgb(200, 100, 100)';

      case Axis.PY:
        return 'rgb(240, 120, 120)';

      case Axis.PZ:
        return 'rgb(160, 80, 80)';

      case Axis.NX:
        return 'rgb(180, 90, 90)';

      case Axis.NY:
        return 'rgb(140, 70, 70)';

      case Axis.NZ:
        return 'rgb(220, 110, 110)';

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
   */
  PPUpdate() {
    let attachedBlock = null;
    let broken = false;
    switch (this.states.facing) {
      case 'east':
        attachedBlock = this.engine.block(this.x - 1, this.y, this.z);
        if (!attachedBlock?.sideSupport) {
          broken = true;
        }
        break;

      case 'west':
        attachedBlock = this.engine.block(this.x + 1, this.y, this.z);
        if (!attachedBlock?.sideSupport) {
          broken = true;
        }
        break;
      
      case 'south':
        attachedBlock = this.engine.block(this.x, this.y, this.z - 1);
        if (!attachedBlock?.sideSupport) {
          broken = true;
        }
        break;

      case 'north':
        attachedBlock = this.engine.block(this.x, this.y, this.z + 1);
        if (!attachedBlock?.sideSupport) {
          broken = true;
        }
        break;
      
      default:
        attachedBlock = this.engine.block(this.x, this.y - 1, this.z);
        if (!attachedBlock?.upperSupport) {
          broken = true;
        }
        break;
    }

    if (broken) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
    }

    if (!attachedBlock?.states.power !== this.states.lit) {
      this.engine.addTask('torchUpdate', [this.x, this.y, this.z, !attachedBlock?.states.power], 2);
    }
  }

  /**
   * 更新此紅石火把的明暗狀態
   * @param {boolean} lit 
   */
  torchUpdate(lit) {
    this.states.lit = lit;
    this.states.source = lit;
    this.sendPPUpdate();
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

export { RedstoneTorch };