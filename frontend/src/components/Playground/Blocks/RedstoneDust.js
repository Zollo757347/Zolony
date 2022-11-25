import Axis from "../../../utils/Axis";
import Vector3 from "../../../utils/Vector3";
import Block from "./Block";

const d = 0.01

/**
 * 代表一個紅石粉
 */
class RedstoneDust extends Block {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 100 });
    
    this.states = { east: 0, south: 0, west: 0, north: 0, power: 0 };
  }

  /**
   * 取得此方塊指定平面的資訊
   * @returns 
   */
  surfaces() {
    const color = 'rgba(200, 100, 100)';
    const result = [{ points: this._surfaces.middle.map(i => new Vector3(...this._vertices[i])), color, norm: Axis.PY, cords: new Vector3(this.x, this.y, this.z) }];
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
  surfaceColor(dir) {
    switch (dir) {
      case Axis.PX:
        return 'rgba(200, 100, 100)';

      case Axis.PY:
        return 'rgba(240, 140, 140)';

      case Axis.PZ:
        return 'rgba(160,  60,  60)';

      case Axis.NX:
        return 'rgba(180,  80,  80)';

      case Axis.NY:
        return 'rgba(140,  40,  40)';

      case Axis.NZ:
        return 'rgba(220, 120, 120)';

      default:
        throw new Error();
    }
  }

  update() {
    this.states.east = 0;
    if (this.x + 1 < this.engine.xLen) {
      if (this.engine.block(this.x + 1, this.y, this.z).type === 100) {
        this.states.east = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x + 1, this.y - 1, this.z).type === 100) {
        this.states.east = 1;
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x + 1, this.y + 1, this.z).type === 100) {
        this.states.east = 2;
      }
    }

    this.states.south = 0;
    if (this.z + 1 < this.engine.xLen) {
      if (this.engine.block(this.x, this.y, this.z + 1).type === 100) {
        this.states.south = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x, this.y - 1, this.z + 1).type === 100) {
        this.states.south = 1;
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x, this.y + 1, this.z + 1).type === 100) {
        this.states.south = 2;
      }
    }

    this.states.west = 0;
    if (this.x - 1 >= 0) {
      if (this.engine.block(this.x - 1, this.y, this.z).type === 100) {
        this.states.west = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x - 1, this.y - 1, this.z).type === 100) {
        this.states.west = 1;
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x - 1, this.y + 1, this.z).type === 100) {
        this.states.west = 2;
      }
    }

    this.states.north = 0;
    if (this.z - 1 >= 0) {
      if (this.engine.block(this.x, this.y, this.z - 1).type === 100) {
        this.states.north = 1;
      }
      if (this.y - 1 >= 0 && this.engine.block(this.x, this.y - 1, this.z - 1).type === 100) {
        this.states.north = 1;
      }
      if (this.y + 1 < this.engine.yLen && this.engine.block(this.x, this.y + 1, this.z - 1).type === 100) {
        this.states.north = 2;
      }
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
  _otherSurfacesOf(dir) {
    if (!this.states[dir]) return [];

    const result = [];

    result.push({
      points: this._surfaces[dir][0].map(i => new Vector3(...this._vertices[i])), 
      color: 'rgba(200, 100, 100)', 
      norm: Axis.PY, 
      cords: new Vector3(this.x, this.y, this.z)
    });

    if (this.states[dir] === 2) {
      let norm;
      switch (dir) {
        case 'east': norm = Axis.NX; break;
        case 'south': norm = Axis.NZ; break;
        case 'west': norm = Axis.PX; break;
        case 'north': norm = Axis.PZ; break;
        default: break;
      }
      result.push({
        points: this._surfaces[dir][1].map(i => new Vector3(...this._vertices[i])), 
        color: 'rgba(200, 100, 100)', 
        norm: norm, 
        cords: new Vector3(this.x, this.y, this.z)
      });
    }

    return result;
  }
}

export default RedstoneDust;