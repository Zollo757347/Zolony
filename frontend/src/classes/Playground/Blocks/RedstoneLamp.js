import Axis from "../../Axis";
import { BlockType } from "../BlockType";
import { FullBlock } from "./FullBlock";

/**
 * @typedef _RedstoneLampState
 * @type {object}
 * @property {boolean} lit 此紅石燈是否被觸發
 * 
 * @typedef {import("./Block").BlockState & _RedstoneLampState} RedstoneLampState
 */

/**
 * 代表一個紅石燈
 */
class RedstoneLamp extends FullBlock {
  constructor(options) {
    super({ type: BlockType.RedstoneLamp, name: 'Redstone Lamp', ...options });

    /**
     * 此紅石燈的狀態
     * @type {RedstoneLampState}
     */
    this.states = { ...(this.states ?? {}), lit: false };
  }

  /**
   * 取得此方塊指定平面的顏色
   * @param {symbol} dir 指定平面的法向量方向
   * @returns {string}
   */
  surfaceColor(dir) {
    switch (dir) {
      case Axis.PX:
        return this.states.lit ? 'rgb(200, 200, 100)' : 'rgb(150, 150, 75)';

      case Axis.PY:
        return this.states.lit ? 'rgb(240, 240, 120)' : 'rgb(180, 180, 90)';

      case Axis.PZ:
        return this.states.lit ? 'rgb(160, 160, 80)' : 'rgb(120, 120, 60)';

      case Axis.NX:
        return this.states.lit ? 'rgb(180, 180, 90)' : 'rgb(135, 135, 68)';

      case Axis.NY:
        return this.states.lit ? 'rgb(140, 140, 70)' : 'rgb(105, 105, 53)';

      case Axis.NZ:
        return this.states.lit ? 'rgb(220, 220, 110)' : 'rgb(165, 165, 83)';

      default:
        throw new Error();
    }
  }

  PPUpdate() {
    super.PPUpdate();

    if (this._shouldLit()) {
      this.states.lit = true;
    }
    else {
      this.engine.addTask('lampUnlit', [this.x, this.y, this.z], 4);
    }
  }

  lampUnlit() {
    if (this._shouldLit()) return;

    this.states.lit = false;
  }


  /**
   * 判斷此紅石燈是否應該要被點亮
   * @returns {boolean}
   * @private
   */
  _shouldLit() {
    if (this.power) return true;

    const litByPower = [[Axis.PX, 'east'], [Axis.NX, 'west'], [Axis.PY, 'up'], [Axis.NY, ''], [Axis.PZ, 'south'], [Axis.NZ, 'north']].some(([dir, facing]) => {
      const norm = Axis.VECTOR[dir];
      const block = this.engine.block(this.x + norm.x, this.y + norm.y, this.z + norm.z);

      if (!block) return false;
      if (block.type === BlockType.RedstoneDust) return block.power && block.doPointTo(Axis.ReverseTable[dir]);
      if (block.type === BlockType.RedstoneTorch) return block.states.facing !== facing;
      return block.states.source || !!block?.power;
    });
    if (litByPower) return true;

  }
}

export { RedstoneLamp };