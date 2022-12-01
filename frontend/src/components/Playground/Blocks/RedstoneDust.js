import Axis from "../../../utils/Axis";
import Utils from "../../../utils/Utils";
import Vector3 from "../../../utils/Vector3";
import Block from "./Block";

const d = 0.001;

/**
 * @typedef RedstoneDustState
 * @type {object}
 * @property {number} east 紅石粉東側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} south 紅石粉南側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} west 紅石粉西側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} north 紅石粉北側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} power 此紅石粉的充能等級
 */

/**
 * 代表一個紅石粉方塊
 */
class RedstoneDust extends Block {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 100, needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: true });
    
    /**
     * 此紅石粉的狀態
     * @type {RedstoneDustState}
     */
    this.states = { east: 1, south: 1, west: 1, north: 1, power: 0 };

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
   * 取得此方塊指定平面的材質
   * @returns 
   */
  surfaceColor() {
    const brightness = this.power * 8 + 100;
    return `rgba(${brightness}, ${brightness >> 1}, ${brightness >> 1})`;
  }

  /**
   * 與此紅石粉互動一次
   */
  interact() {
    this.crossMode = !this.crossMode;
    this.sendPPUpdate();
  }

  sendPPUpdate() {
    [Axis.NX, Axis.PX, Axis.NZ, Axis.PZ, Axis.NY, Axis.PY].forEach((dir, i) => {
      const norm = Axis.VECTOR[dir];
      const target = this.engine.block(this.x + norm.x, this.y + norm.y, this.z + norm.z);
      target?.PPUpdate(Axis.ReverseTable[dir]);

      if (i <= 3 && this.doPointTo(dir) && target?.type !== 100) {
        this.engine.block(this.x + norm.x, this.y + norm.y + 1, this.z + norm.z)?.PPUpdate(Axis.ReverseTable[dir]);
        this.engine.block(this.x + norm.x, this.y + norm.y - 1, this.z + norm.z)?.PPUpdate(Axis.ReverseTable[dir]);
      }
    });
    this.PPUpdate();
  }

  PPUpdate() {
    const oldStates = JSON.parse(JSON.stringify(this.states));
    let maxDiaDustPower = 0;

    if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
      this.engine.leftClick(this.x, this.y, this.z);
    }

    this.states.east = 0;
    if (this.x + 1 < this.engine.xLen) {
      if (this.engine.block(this.x + 1, this.y, this.z).redstoneAutoConnect) {
        this.states.east = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x + 1, this.y - 1, this.z).type === 100 && this.engine.block(this.x + 1, this.y, this.z).transparent) {
        this.states.east = 1;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x + 1, this.y - 1, this.z).power);
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x + 1, this.y + 1, this.z).type === 100 && this.engine.block(this.x, this.y + 1, this.z).transparent) {
        this.states.east = 2;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x + 1, this.y + 1, this.z).power);
      }
    }

    this.states.south = 0;
    if (this.z + 1 < this.engine.xLen) {
      if (this.engine.block(this.x, this.y, this.z + 1).redstoneAutoConnect) {
        this.states.south = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x, this.y - 1, this.z + 1).type === 100 && this.engine.block(this.x, this.y, this.z + 1).transparent) {
        this.states.south = 1;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x, this.y - 1, this.z + 1).power);
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x, this.y + 1, this.z + 1).type === 100 && this.engine.block(this.x, this.y + 1, this.z).transparent) {
        this.states.south = 2;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x, this.y + 1, this.z + 1).power);
      }
    }

    this.states.west = 0;
    if (this.x - 1 >= 0) {
      if (this.engine.block(this.x - 1, this.y, this.z).redstoneAutoConnect) {
        this.states.west = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x - 1, this.y - 1, this.z).type === 100 && this.engine.block(this.x - 1, this.y, this.z).transparent) {
        this.states.west = 1;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x - 1, this.y - 1, this.z).power);
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x - 1, this.y + 1, this.z).type === 100 && this.engine.block(this.x, this.y + 1, this.z).transparent) {
        this.states.west = 2;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x - 1, this.y + 1, this.z).power);
      }
    }

    this.states.north = 0;
    if (this.z - 1 >= 0) {
      if (this.engine.block(this.x, this.y, this.z - 1).redstoneAutoConnect) {
        this.states.north = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x, this.y - 1, this.z - 1).type === 100 && this.engine.block(this.x, this.y, this.z - 1).transparent) {
        this.states.north = 1;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x, this.y - 1, this.z - 1).power);
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x, this.y + 1, this.z - 1).type === 100 && this.engine.block(this.x, this.y + 1, this.z).transparent) {
        this.states.north = 2;
        maxDiaDustPower = Math.max(maxDiaDustPower, this.engine.block(this.x, this.y + 1, this.z - 1).power);
      }
    }

    const explicitDir = Object.entries(this.states)
      .map(([dir, val]) => val ? dir : undefined)
      .filter((dir) => dir && dir !== 'power');
    
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

    this.states.power = Math.max(
      this.engine.block(this.x + 1, this.y, this.z)?.power || 0, 
      this.engine.block(this.x, this.y + 1, this.z)?.power || 0, 
      this.engine.block(this.x, this.y, this.z + 1)?.power || 0, 
      this.engine.block(this.x - 1, this.y, this.z)?.power || 0, 
      this.engine.block(this.x, this.y - 1, this.z)?.power || 0, 
      this.engine.block(this.x, this.y, this.z - 1)?.power || 0, 
      maxDiaDustPower, 
      1
    ) - 1;

    if (!Utils.StrictEqual(oldStates, this.states)) {
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
        return !!this.states.south;
      
      case Axis.PZ:
        return !!this.states.north;

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
}

export default RedstoneDust;