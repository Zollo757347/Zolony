import Axis from "../../Axis";
import Vector3 from "../../Vector3";
import { Block } from "./Block";

// const d = 0.001;

/**
 * @typedef RedstoneRepeaterState
 * @type {object}
 * @property {number} delay 紅石中繼器的延遲
 * @property {string} facing 紅石中繼器的指向
 * @property {boolean} locked 紅石中繼器是否被鎖定
 * @property {boolean} powered 紅石中繼器是否被激發
 */

/**
 * 代表一個紅石中繼器
 */
class RedstoneRepeater extends Block {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 102, needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'lined' });
    
    /**
     * 此紅石中繼器的狀態
     * @type {RedstoneRepeaterState}
     */
    this.states = { delay: 1, facing: 'north', locked: false, powered: false };
  }

  get power() {
    return 0;
  }

  setFacing(dir) {
    switch (dir) {
      case Axis.PX:
        this.states.facing = 'west';
        return;

      case Axis.NX:
        this.states.facing = 'east';
        return;

      case Axis.PZ:
        this.states.facing = 'north';
        return;

      case Axis.NZ:
        this.states.facing = 'south';
        return;
      
      default:
        this.states.facing = 'north';
        return;        
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
   * 取得此方塊指定平面的材質
   * @returns 
   */
  surfaceColor() {
    const brightness = this.states.powered ? 250 : 125;
    return `rgba(${brightness}, ${(brightness >> 1) + this.states.delay * 30}, ${brightness >> 1})`;
  }

  _interactionBoxVertices = [
    [this.x    , this.y        , this.z], 
    [this.x + 1, this.y        , this.z], 
    [this.x    , this.y + 0.125, this.z], 
    [this.x + 1, this.y + 0.125, this.z], 
    [this.x    , this.y        , this.z + 1], 
    [this.x + 1, this.y        , this.z + 1], 
    [this.x    , this.y + 0.125, this.z + 1], 
    [this.x + 1, this.y + 0.125, this.z + 1]
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
    return this._interactionBoxSurfaces[dir].map(i => new Vector3(...this._interactionBoxVertices[i]));
  }

  /**
   * 與此紅石中繼器互動一次
   */
  interact() {
    this.states.delay = this.states.delay === 4 ? 1 : this.states.delay + 1;
    this.sendPPUpdate();
  }

  // temprarily take PP and NC update as the same
  PPUpdate() {
    let x, y, z;
    switch (this.states.facing) {
      case 'west':
        [x, y, z] = [1, 0, 0];
        break;
      
      case 'east':
        [x, y, z] = [-1, 0, 0];
        break;

      case 'north':
        [x, y, z] = [0, 0, 1];
        break;

      case 'south':
        [x, y, z] = [0, 0, -1];
        break;

      default:
        throw new Error(`${this.states.facing} is not a valid direction.`);
    }

    const oldPowered = this.states.powered;
    let newPowered;
    const block = this.engine.block(this.x + x, this.y + y, this.z + z);
    if (block && (block.power || (block.type === 102 && block.states.facing === this.states.facing && block.states.powered))) {
      newPowered = true;
    }
    else {
      newPowered = false;
    }

    if (oldPowered !== newPowered) {
      this.engine.addTask('repeaterUpdate', [this.x, this.y, this.z, newPowered], this.states.delay * 2);
    }
  }

  repeaterUpdate(powered) {
    this.states.powered = powered;
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
    [this.x    , this.y        , this.z], 
    [this.x + 1, this.y        , this.z], 
    [this.x    , this.y + 0.125, this.z], 
    [this.x + 1, this.y + 0.125, this.z], 
    [this.x    , this.y        , this.z + 1], 
    [this.x + 1, this.y        , this.z + 1], 
    [this.x    , this.y + 0.125, this.z + 1], 
    [this.x + 1, this.y + 0.125, this.z + 1], 
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

export { RedstoneRepeater };