import Axis from "../../Axis";
import Vector3 from "../../Vector3";
import { BlockType } from "../BlockType";
import { Block } from "./Block";

/**
 * @typedef _LeverStates
 * @type {object}
 * @property {'wall' | 'ceiling' | 'floor'} face 此控制桿的附著位置
 * @property {'east' | 'west' | 'south' | 'north'} facing 此控制桿的面向方向
 * @property {boolean} powered 此控制桿是否被拉下
 * 
 * @typedef {import("./Block").BlockStates & _LeverStates} LeverStates
 */

/**
 * 代表一個控制桿
 */
class Lever extends Block {
  constructor(options) {
    super({ type: BlockType.Lever, blockName: 'Lever', transparent: true, needSupport: true, interactable: true, redstoneAutoConnect: 'full', ...options });

    /**
     * 此控制桿的狀態
     * @type {LeverStates}
     */
    this.states = { ...(this.states ?? {}), face: 'wall', facing: 'north', powered: false };
  }

  get power() {
    return this.states.powered ? 15 : 0;
  }

  interact() {
    this.states.powered = !this.states.powered;
    this.states.source = this.states.powered;
    this.sendPPUpdate();
  }

  /**
   * 設定控制桿面向的方向
   * @param {symbol} normDir 指定面的法向量方向
   * @param {symbol} facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir, facingDir) {
    switch (normDir) {
      case Axis.PX: 
        this.states.face = 'wall';
        this.states.facing = 'east';
        break;

      case Axis.NX:
        this.states.face = 'wall';
        this.states.facing = 'west';
        break;

      case Axis.PY:
        this.states.face = 'floor';
        this.states.facing = 'north';
        break;

      case Axis.NY:
        this.states.face = 'ceiling';
        this.states.facing = 'north';
        break;

      case Axis.PZ:
        this.states.face = 'wall';
        this.states.facing = 'south';
        break;

      case Axis.NZ:
        this.states.face = 'wall';
        this.states.facing = 'north';
        break;

      default:
        this.states.face = 'wall';
        this.states.facing = 'north';
        break;
    }
  }

  surfaces() {
    return [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].map(dir => {
      return { points: this._surfaceOf(dir), color: this.surfaceColor(dir), dir, cords: new Vector3(this.x, this.y, this.z) };
    });
  }

  /**
   * 取得此方塊指定平面的顏色
   * @param {symbol} dir 指定平面的法向量方向
   * @returns {string}
   */
  surfaceColor(dir) {
    switch (dir) {
      case Axis.PX:
        return this.states.powered ? 'rgb(200, 100, 100)' : 'rgb(150, 150, 150)';

      case Axis.PY:
        return this.states.powered ? 'rgb(240, 120, 120)' : 'rgb(180, 180, 180)';

      case Axis.PZ:
        return this.states.powered ? 'rgb(160, 80, 80)' : 'rgb(120, 120, 120)';

      case Axis.NX:
        return this.states.powered ? 'rgb(180, 90, 90)' : 'rgb(135, 135, 135)';

      case Axis.NY:
        return this.states.powered ? 'rgb(140, 70, 70)' : 'rgb(105, 105, 105)';

      case Axis.NZ:
        return this.states.powered ? 'rgb(220, 110, 110)' : 'rgb(165, 165, 165)';

      default:
        throw new Error();
    }
  }

  PPUpdate() {
    let attachedBlock = null;
    let broken = false;
    switch (this.states.face) {
      case 'ceiling':
        attachedBlock = this.engine.block(this.x, this.y + 1, this.z);
        if (!attachedBlock?.bottomSupport) {
          broken = true;
        }
        break;

      case 'floor':
        attachedBlock = this.engine.block(this.x, this.y - 1, this.z);
        if (!attachedBlock?.upperSupport) {
          broken = true;
        }
        break;

      case 'wall':
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

          default: break;
        }
        break;

      default: break;
    }

    if (broken) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
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
  /***/
  _vertices = [
    [this.x       , this.y       , this.z], 
    [this.x + 0.25, this.y       , this.z], 
    [this.x       , this.y + 0.25, this.z], 
    [this.x + 0.25, this.y + 0.25, this.z], 
    [this.x       , this.y       , this.z + 0.25], 
    [this.x + 0.25, this.y       , this.z + 0.25], 
    [this.x       , this.y + 0.25, this.z + 0.25], 
    [this.x + 0.25, this.y + 0.25, this.z + 0.25]
  ];
  _surfaces = {
    [Axis.PX]: [1, 3, 7, 5], 
    [Axis.PY]: [2, 3, 7, 6], 
    [Axis.PZ]: [4, 5, 7, 6], 
    [Axis.NX]: [0, 2, 6, 4], 
    [Axis.NY]: [0, 1, 5, 4], 
    [Axis.NZ]: [0, 1, 3, 2]
  };

  get _surfaceOffset() {
    switch (this.states.face) {
      case 'ceiling':
        return [0.375, 0.75, 0.375];

      case 'floor':
        return [0.375, 0, 0.375];

      case 'wall':
        switch (this.states.facing) {
          case 'east':
            return [0, 0.375, 0.375];

          case 'west':
            return [0.75, 0.375, 0.375];

          case 'south':
            return [0.375, 0.375, 0];

          case 'north':
            return [0.375, 0.375, 0.75];

          default: break;
        }
        break;

      default: break;
    }
    return [0, 0, 0];
  }

  /**
   * 取得指定平面的頂點座標
   * @param {symbol} dir 指定平面的法向量方向
   * @returns {Vector3[]}
   * @private
   */
  _surfaceOf(dir) {
    return this._surfaces[dir].map(i => {
      let [x, y, z] = this._vertices[i];
      const [ox, oy, oz] = this._surfaceOffset;
      x += ox;
      y += oy;
      z += oz;

      return new Vector3(x, y, z);
    });
  }
}

export { Lever };