import Axis from "../../Axis";
import Vector3 from "../../Vector3";
import Utils from "../../Utils";
import { Block } from "./Block";
import { BlockType } from "../BlockType";

const d = 0.001;

/**
 * @typedef _RedstoneDustStates
 * @type {object}
 * @property {number} east 紅石粉東側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} south 紅石粉南側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} west 紅石粉西側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} north 紅石粉北側的連接狀態，0 為無，1 為有，2 為有且向上
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneDustStates} RedstoneDustStates
 */

/**
 * 代表一個紅石粉方塊
 */
class RedstoneDust extends Block {
  constructor(options) {
    super({ type: BlockType.RedstoneDust, blockName: 'Redstone Dust', needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'full', ...options });
    
    /**
     * 此紅石粉的狀態
     * @type {RedstoneDustStates}
     */
    this.states = { ...(this.states ?? {}), east: 1, south: 1, west: 1, north: 1, power: 0, source: true };

    /**
     * 此紅石粉閒置時是否處於向四周充能的狀態
     * @type {boolean}
     */
    this.crossMode = true;
  }

  get power() {
    return this.states.power;
  }

  /**
   * 取得此方塊所有平面的資訊
   * @returns {import("../Playground").Surface[]}
   */
  surfaces() {
    const result = [{ points: this._surfaces.middle.map(i => new Vector3(...this._vertices[i])), color: this.surfaceColor(), dir: Axis.PY, cords: new Vector3(this.x, this.y, this.z) }];
    result.push(...this._otherSurfacesOf('east'));
    result.push(...this._otherSurfacesOf('south'));
    result.push(...this._otherSurfacesOf('west'));
    result.push(...this._otherSurfacesOf('north'));

    return result;
  }

  /**
   * 取得此方塊指定平面的顏色
   * @returns 
   */
  surfaceColor() {
    const brightness = this.power * 8 + 100;
    return [brightness, brightness >> 1, brightness >> 1];
  }

  interactionSurfaces() {
    return [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].map(dir => {
      return { points: this._interactionSurfaceOf(dir), dir, cords: new Vector3(this.x, this.y, this.z) };
    });
  }

  /**
   * 與此紅石粉互動一次
   */
  interact() {
    this.crossMode = !this.crossMode;
    this.sendPPUpdate();
  }

  sendPPUpdate() {
    this.engine.needRender = true;
    
    this.PPUpdate();
    [Axis.NX, Axis.PX, Axis.NZ, Axis.PZ, Axis.NY, Axis.PY].forEach((dir, i) => {
      const norm = Axis.VECTOR[dir];
      const target = this.engine.block(this.x + norm.x, this.y + norm.y, this.z + norm.z);
      target?.PPUpdate(Axis.ReverseTable[dir]);

      // 如果有指向側邊，側邊的上下兩個方塊也要更新
      if (i <= 3 && this.doPointTo(dir) && target?.type !== BlockType.RedstoneDust) {
        this.engine.block(this.x + norm.x, this.y + norm.y - 1, this.z + norm.z)?.PPUpdate(Axis.ReverseTable[dir]);
        this.engine.block(this.x + norm.x, this.y + norm.y + 1, this.z + norm.z)?.PPUpdate(Axis.ReverseTable[dir]);
      }
    });
  }

  // temprarily take PP and NC update as the same
  PPUpdate() {
    this._changeShape();
    this._changePower();
  }


  /**
   * 更新自身的指向
   * @private
   */
  _changeShape() {
    const oldStates = JSON.parse(JSON.stringify(this.states));

    if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
    }

    [[1, 0, 'east', 'west'], [0, 1, 'south', 'north'], [-1, 0, 'west', 'east'], [0, -1, 'north', 'south']].forEach(([dx, dz, dir, rdir]) => {
      this.states[dir] = 0;
      const x = this.x + dx, z = this.z + dz;
      const block = this.engine.block(x, this.y, z);

      if (block?.redstoneAutoConnect) {
        if (block.redstoneAutoConnect === 'full' || (block.redstoneAutoConnect === 'lined' && [dir, rdir].includes(block.states.facing))) {
          this.states[dir] = 1;
        }
      }

      if (this.engine.block(x, this.y - 1, z)?.type === BlockType.RedstoneDust && this.engine.block(x, this.y, z)?.transparent) {
        this.states[dir] = 1;
      }
      if (this.engine.block(x, this.y + 1, z)?.type === BlockType.RedstoneDust && this.engine.block(this.x, this.y + 1, this.z)?.transparent) {
        this.states[dir] = 2;
      }
    });

    const explicitDir = Object.entries(this.states)
      .map(([dir, val]) => val ? dir : undefined)
      .filter((dir) => dir && dir !== 'power' && dir !== 'source' && dir !== '__typename');
    
    if (explicitDir.length === 0) {
      if (this.crossMode) {
        this.states.east = this.states.south = this.states.west = this.states.north = 1;
      }
    }
    else {
      this.crossMode = true;
      if (explicitDir.length === 1) {
        switch (explicitDir[0]) {
          case 'east': this.states.west = 1; break;
          case 'south': this.states.north = 1; break;
          case 'west': this.states.east = 1; break;
          case 'north': this.states.south = 1; break;
          default: break;
        }
      }
    }

    if (!Utils.StrictEqual(oldStates, this.states)) {
      this.sendPPUpdate();
    }
  }

  /**
   * 更新自身的充能強度
   * @private
   */
  _changePower() {
    const oldPower = this.states.power;
    let newPower = 1;
    [Axis.NX, Axis.PX, Axis.NZ, Axis.PZ, Axis.NY, Axis.PY].forEach(dir => {
      const norm = Axis.VECTOR[dir];
      const block = this.engine.block(this.x + norm.x, this.y + norm.y, this.z + norm.z);
      newPower = Math.max(newPower, block?.states.source ? block?.power ?? 1 : 1);
    });

    [[1, 0, 'west'], [0, 1, 'north'], [-1, 0, 'east'], [0, -1, 'south']].forEach(([dx, dz, dir]) => {
      const sideDown = this.engine.block(this.x + dx, this.y - 1, this.z + dz);
      const sideHori = this.engine.block(this.x + dx, this.y, this.z + dz);
      const sideUp = this.engine.block(this.x + dx, this.y + 1, this.z + dz);
      const above = this.engine.block(this.x, this.y + 1, this.z);

      if (sideHori?.transparent && sideDown?.type === BlockType.RedstoneDust) {
        newPower = Math.max(newPower, sideDown.power);
      }
      else if (sideHori?.type === BlockType.RedstoneRepeater && sideHori.states.powered && sideHori.states.facing === dir) {
        newPower = 16; // 之後會被減 1
      }

      if (above?.transparent && sideUp?.type === BlockType.RedstoneDust) {
        newPower = Math.max(newPower, sideUp.power);
      }
    });

    this.states.power = newPower - 1;
    if (oldPower !== newPower - 1) {
      this.sendPPUpdate();
    }
  }

  /**
   * 檢查紅石粉有沒有指向某一個方向
   * @param {symbol} dir 
   * @returns {boolean}
   */
  doPointTo(dir) {
    switch (dir) {
      case Axis.NX:
        return !!this.states.west;
      
      case Axis.PX:
        return !!this.states.east;

      case Axis.NZ:
        return !!this.states.north;
      
      case Axis.PZ:
        return !!this.states.south;

      default:
        return false;
    }
  }

  /**
   *       12-----13
   *        \     /
   *  19     0---1     14
   *  | \    |   |    / |
   *  |  10-11   2---3  |
   *  |  |           |  | --x
   *  |  9---8   5---4  |
   *  | /    |   |    \ |
   *  18     7---6     15
   *        /     \
   *       17-----16
   *           |         ⊙y
   *           z
   */
  /***/
  _vertices = [
    [this.x + 0.375, this.y + d, this.z], 
    [this.x + 0.625, this.y + d, this.z], 
    [this.x + 0.625, this.y + d, this.z + 0.375], 
    [this.x + 1    , this.y + d, this.z + 0.375], 
    [this.x + 1    , this.y + d, this.z + 0.625], 
    [this.x + 0.625, this.y + d, this.z + 0.625], 
    [this.x + 0.625, this.y + d, this.z + 1], 
    [this.x + 0.375, this.y + d, this.z + 1], 
    [this.x + 0.375, this.y + d, this.z + 0.625], 
    [this.x        , this.y + d, this.z + 0.625], 
    [this.x        , this.y + d, this.z + 0.375], 
    [this.x + 0.375, this.y + d, this.z + 0.375], 

    [this.x + 0.375, this.y + 1, this.z + d], 
    [this.x + 0.625, this.y + 1, this.z + d], 
    [this.x + 1 - d, this.y + 1, this.z + 0.375], 
    [this.x + 1 - d, this.y + 1, this.z + 0.625], 
    [this.x + 0.625, this.y + 1, this.z + 1 - d], 
    [this.x + 0.375, this.y + 1, this.z + 1 - d], 
    [this.x + d    , this.y + 1, this.z + 0.625], 
    [this.x + d    , this.y + 1, this.z + 0.375], 
  ];
  _surfaces = {
    middle: [2, 5, 8, 11], 
    east: [[2, 3, 4, 5], [3, 14, 15, 4]], 
    south: [[5, 6, 7, 8], [6, 16, 17, 7]], 
    west: [[8, 9, 10, 11], [9, 18, 19, 10]], 
    north: [[0, 1, 2, 11], [0, 1, 13, 12]]
  };

  /**
   * 取得此紅石粉指定方向所應渲染的所有平面
   * @param {symbol} dir 指定的法向量方向
   * @returns {import("../Playground").Surface[]}
   * @private
   */
  _otherSurfacesOf(dirName) {
    if (!this.states[dirName]) return [];

    const result = [];

    result.push({
      points: this._surfaces[dirName][0].map(i => new Vector3(...this._vertices[i])), 
      color: this.surfaceColor(), 
      dir: Axis.PY, 
      cords: new Vector3(this.x, this.y, this.z)
    });

    if (this.states[dirName] === 2) {
      let dir;
      switch (dirName) {
        case 'east': dir = Axis.NX; break;
        case 'south': dir = Axis.NZ; break;
        case 'west': dir = Axis.PX; break;
        case 'north': dir = Axis.PZ; break;
        default: break;
      }
      result.push({
        points: this._surfaces[dirName][1].map(i => new Vector3(...this._vertices[i])), 
        color: this.surfaceColor(), 
        dir, 
        cords: new Vector3(this.x, this.y, this.z)
      });
    }

    return result;
  }

  _interactionBoxVertices = [
    [this.x    , this.y         , this.z], 
    [this.x + 1, this.y         , this.z], 
    [this.x    , this.y + 0.0625, this.z], 
    [this.x + 1, this.y + 0.0625, this.z], 
    [this.x    , this.y         , this.z + 1], 
    [this.x + 1, this.y         , this.z + 1], 
    [this.x    , this.y + 0.0625, this.z + 1], 
    [this.x + 1, this.y + 0.0625, this.z + 1]
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

export { RedstoneDust };