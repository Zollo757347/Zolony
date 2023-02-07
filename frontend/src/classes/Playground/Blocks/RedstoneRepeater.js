import Axis from "../../Axis";
import Vector3 from "../../Vector3";
import { BlockType } from "../BlockType";
import { Block } from "./Block";

const d = 0.001;

/**
 * @typedef _RedstoneRepeaterStates
 * @type {object}
 * @property {number} delay 紅石中繼器的延遲
 * @property {string} facing 紅石中繼器的指向
 * @property {boolean} locked 紅石中繼器是否被鎖定
 * @property {boolean} powered 紅石中繼器是否被激發
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneRepeaterStates} RedstoneRepeaterStates
 */

/**
 * 代表一個紅石中繼器
 */
class RedstoneRepeater extends Block {
  constructor(options) {
    super({ type: BlockType.RedstoneRepeater, blockName: 'Redstone Repeater', needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'lined', ...options });
    
    /**
     * 此紅石中繼器的狀態
     * @type {RedstoneRepeaterStates}
     */
    this.states = { ...(this.states ?? {}), delay: 1, facing: 'north', locked: false, powered: false };
  }

  get power() {
    return 0;
  }

  /**
   * 設定中繼器面向的方向
   * @param {symbol} normDir 指定面的法向量方向
   * @param {symbol} facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir, facingDir) {
    switch (facingDir) {
      case Axis.PX:
        this.states.facing = 'east';
        return;

      case Axis.NX:
        this.states.facing = 'west';
        return;

      case Axis.PZ:
        this.states.facing = 'south';
        return;

      case Axis.NZ:
        this.states.facing = 'north';
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
    const result = [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].map(dir => {
      return { points: this._surfaceOf(dir), color: [210, 210, 210], dir, cords: new Vector3(this.x, this.y, this.z) };
    });

    const basis = this._textureSurfaces[this.states.facing];
    basis.forEach(([dx, dz], i) => {
      const [x, y, z] = [this.x + dx * 0.125, this.y + 0.125 + d, this.z + dz * 0.125];
      const color = this.states.locked && i === this.states.delay ? [50, 50, 50] : this.surfaceColor(i === 0 || i === this.states.delay);
      const extend = this.states.locked && i === this.states.delay ? this._lockExtend[this.states.facing].map(a => a.map(b => b * 0.125)) : [[0, 0], [0, 0]];

      const points = [
        new Vector3(x + extend[0][0],         y, z + extend[0][1]), 
        new Vector3(x + extend[1][0] + 0.125, y, z + extend[0][1]), 
        new Vector3(x + extend[1][0] + 0.125, y, z + extend[1][1] + 0.125), 
        new Vector3(x + extend[0][0],         y, z + extend[1][1] + 0.125)
      ];
      result.push({ points, color, dir: Axis.PY, cords: new Vector3(this.x, this.y, this.z) });
    });

    return result;
  }

  /**
   * 取得此方塊指定平面的顏色
   * @returns 
   */
  surfaceColor(indicator) {
    const brightness = (this.states.powered ? 150 : 100) + indicator * 100;
    return [brightness, brightness >> 1, brightness >> 1];
  }

  interactionSurfaces() {
    const result = [];

    [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].forEach(dir => {
      result.push({ points: this._interactionSurfaceOf(dir), dir, cords: new Vector3(this.x, this.y, this.z) });
    });

    return result.filter(r => !!r);
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
    if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
    }

    let x, y, z, sx, sy, sz, ds, dr;
    switch (this.states.facing) {
      case 'west':
        [x, y, z] = [1, 0, 0];
        [sx, sy, sz, ds, dr] = [0, 0, 1, 'north', 'south'];
        break;
      
      case 'east':
        [x, y, z] = [-1, 0, 0];
        [sx, sy, sz, ds, dr] = [0, 0, 1, 'north', 'south'];
        break;

      case 'north':
        [x, y, z] = [0, 0, 1];
        [sx, sy, sz, ds, dr] = [1, 0, 0, 'west', 'east'];
        break;

      case 'south':
        [x, y, z] = [0, 0, -1];
        [sx, sy, sz, ds, dr] = [1, 0, 0, 'west', 'east'];
        break;

      default:
        throw new Error(`${this.states.facing} is not a valid direction.`);
    }

    const oldPowered = this.states.powered;
    const oldLocked = this.states.locked;
    let newPowered = false, newLocked = false;
    let block = this.engine.block(this.x + x, this.y + y, this.z + z);
    if (block && (block.power || (block.type === BlockType.RedstoneRepeater && block.states.facing === this.states.facing && block.states.powered))) {
      newPowered = true;
    }

    block = this.engine.block(this.x + sx, this.y + sy, this.z + sz);
    if (block && block.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === ds) {
      newLocked = true;
    }

    block = this.engine.block(this.x - sx, this.y - sy, this.z - sz);
    if (block && block.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === dr) {
      newLocked = true;
    }

    if (!newLocked && oldPowered !== newPowered) {
      this.engine.addTask('repeaterUpdate', [this.x, this.y, this.z, newPowered], this.states.delay * 2);
    }
    if (oldLocked !== newLocked) {
      this.states.locked = newLocked;
      this.sendPPUpdate();
    }
  }

  /**
   * 更新此紅石中繼器的激發狀態
   * @param {boolean} powered 
   */
  repeaterUpdate(powered) {
    if (!powered) {
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
      
      const block = this.engine.block(this.x + x, this.y + y, this.z + z);
      if (block && (block.power || (block.type === BlockType.RedstoneRepeater && block.states.facing === this.states.facing && block.states.powered))) {
        return;
      }
    }

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
  /***/
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

  _textureSurfaces = {
    west: [[1, 3.5], [3, 3.5], [4, 3.5], [5, 3.5], [6, 3.5]], 
    east: [[6, 3.5], [4, 3.5], [3, 3.5], [2, 3.5], [1, 3.5]], 
    north: [[3.5, 1], [3.5, 3], [3.5, 4], [3.5, 5], [3.5, 6]], 
    south: [[3.5, 6], [3.5, 4], [3.5, 3], [3.5, 2], [3.5, 1]]
  };
  _lockExtend = {
    west: [[0, -2.5], [0, 2.5]], 
    east: [[0, -2.5], [0, 2.5]], 
    north: [[-2.5, 0], [2.5, 0]], 
    south: [[-2.5, 0], [2.5, 0]]
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

  _interactionSurfaceOf(dir) {
    return this._interactionBoxSurfaces[dir].map(i => new Vector3(...this._interactionBoxVertices[i]));
  }
}

export { RedstoneRepeater };