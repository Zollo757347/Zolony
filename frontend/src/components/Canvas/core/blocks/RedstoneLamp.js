import { BlockType, Maps } from "../utils";
import FullBlock from "./FullBlock";
import { redstone_lamp, redstone_lamp_on } from "../../../../assets/json/blocks";

/**
 * @typedef _RedstoneLampStates
 * @type {object}
 * @property {boolean} lit 此紅石燈是否被觸發
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneLampStates} RedstoneLampStates
 */

/**
 * 代表一個紅石燈
 */
class RedstoneLamp extends FullBlock {
  constructor(options) {
    super({ type: BlockType.RedstoneLamp, blockName: '紅石燈', ...options });

    this._model = {
      lit: redstone_lamp_on, 
      unlit: redstone_lamp
    };

    /**
     * 此紅石燈的狀態
     * @type {RedstoneLampStates}
     */
    this.states = { ...(this.states ?? {}), lit: false };
  }

  get textures() {
    return this.states.lit ? this._model.lit.textures : this._model.unlit.textures;
  }

  get outlines() {
    return this.states.lit ? this._model.lit.outlines : this._model.unlit.outlines;
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

    const litByPower = Maps.P6DArray.some(([dir, [x, y, z]]) => {
      const block = this.engine.block(this.x + x, this.y + y, this.z + z);
      return block?.states.source;
    });
    if (litByPower) return true;
  }
}

export default RedstoneLamp;