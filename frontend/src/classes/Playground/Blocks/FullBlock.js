import Axis from "../../Axis";
import Vector3 from "../../Vector3";
import { BlockType } from "../BlockType";
import { Block } from "./Block";

/**
 * 代表一個單位方塊
 * @abstract
 */
class FullBlock extends Block {
  constructor(options) {
    super({ fullSupport: true, ...options });
  }

  /**
   * 取得此方塊可能需要渲染的表面
   * @returns {import("./Block").Surface[]}
   */
  surfaces() {
    return [Axis.PX, Axis.PY, Axis.PZ, Axis.NX, Axis.NY, Axis.NZ].map(dir => {
      const norm = Axis.VECTOR[dir];
      const x = this.x + norm.x, y = this.y + norm.y, z = this.z + norm.z;
      const block = this.engine.block(x, y, z);

      // 如果隔壁也是單位方塊，在特定條件下不會被看見，因此可以直接不渲染
      if (block && block instanceof FullBlock && (this.type === BlockType.GlassBlock || block.type !== BlockType.GlassBlock)) return undefined;

      return { points: this._surfaceOf(dir), color: this.surfaceColor(dir), dir, cords: new Vector3(this.x, this.y, this.z) };
    }).filter(r => !!r);
  }

  /**
   * 取得此方塊指定平面的顏色
   * @abstract
   */
  surfaceColor() {
    throw new Error('Not implemented yet.');
  }

  /**
   * 更新自身狀態
   */
  PPUpdate() {
    const oldPower = this.states.power;
    const oldSource = this.states.source;

    let power = 0, source = false;
    let block = this.engine.block(this.x, this.y - 1, this.z);

    // 下方的方塊是點亮的紅石火把，強充能至 15
    if (block?.type === BlockType.RedstoneTorch && block.states.lit) {
      power = 15;
      source = true;
    }

    else {
      block = this.engine.block(this.x, this.y + 1, this.z);

      // 上方的方塊是紅石粉，弱充能至相同等級
      if (block?.type === BlockType.RedstoneDust) {
        power = Math.max(power, block.power);
      }

      // 判斷側邊的方塊
      [[1, 0, 'west'], [-1, 0, 'east'], [0, 1, 'north'], [0, -1, 'south']].forEach(([dx, dz, dir]) => {
        block = this.engine.block(this.x + dx, this.y, this.z + dz);

        // 側邊方塊是指向自己的紅石粉，弱充能至相同等級
        if (block?.type === BlockType.RedstoneDust && block.states[dir]) {
          power = Math.max(power, block.power);
        }

        // 側邊方塊是指向自己的紅石中繼器，強充能至 15
        else if (block?.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === dir) {
          power = 15;
          source = true;
        }
      });
    }

    this.states.power = power;
    this.states.source = source;

    if (oldPower !== this.states.power || oldSource !== this.states.source) {
      this.sendPPUpdate();
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

  /**
   * 取得指定平面的頂點座標
   * @param {symbol} dir 指定平面的法向量方向
   * @returns {Vector3[]}
   * @private
   */
  _surfaceOf(dir) {
    return this._surfaces[dir].map(i => new Vector3(...this._vertices[i]));
  }
}

export { FullBlock };