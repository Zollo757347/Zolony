import {
  redstone_torch_off, redstone_torch, redstone_wall_torch_off, redstone_wall_torch
} from "../../../../assets/json/blocks";
import { BlockType, Maps } from "../utils";
import Block from "./Block";

/**
 * @typedef _RedstoneTorchStates
 * @type {object}
 * @property {boolean} lit 此紅石火把是否被觸發
 * @property {import("../utils/parseTexture").FourFacings | 'up'} facing 此紅石火把面向的方向
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneTorchStates} RedstoneTorchStates
 */

class RedstoneTorch extends Block {
  constructor(options) {
    super({ type: BlockType.RedstoneTorch, blockName: '紅石火把', needSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    /**
     * 此紅石火把的狀態
     * @type {RedstoneTorchStates}
     */
    this.states = { ...(this.states ?? {}), lit: true, facing: 'up', source: true };

    this._model = {
      wall: [redstone_wall_torch_off, redstone_wall_torch], 
      floor: [redstone_torch_off, redstone_torch]
    };
  }

  get power() {
    return this.states.lit ? 15 : 0;
  }

  get textures() {
    return this._model.wall[this.states.lit ? 1 : 0][this.states.facing]?.textures ?? this._model.floor[this.states.lit ? 1 : 0].textures;
  }

  get outlines() {
    return this._model.wall[this.states.lit ? 1 : 0][this.states.facing]?.outlines ?? this._model.floor[this.states.lit ? 1 : 0].outlines;
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsBlock(direction) {
    return direction === 'up' && this.states.lit ?
      { strong: true, power: 15 } :
      { strong: false, power: 0 };
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsWire(direction) {
    return { strong: this.states.lit, power: this.states.lit ? 15 : 0 };
  }

  /**
   * 設定紅石火把面向的方向
   * @param {symbol} normDir 指定面的法向量方向
   * @param {symbol} facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir, facingDir) {
    if (normDir === 'down') return;
    this.states.facing = normDir;
  }

  /**
   * 根據 Post Placement Update 的來源方向更新自身狀態
   */
  PPUpdate() {
    super.PPUpdate();
    
    let attachedBlock = null;
    if (this.states.facing === 'up') {
      attachedBlock = this.engine.block(this.x, this.y - 1, this.z);
    }
    else {
      const dir = Maps.P4DMap.get(Maps.ReverseDir[this.states.facing]);
      if (!dir) {
        throw new Error(`${this.states.facing} is not a valid direction.`);
      }

      const [x, , z] = dir;
      attachedBlock = this.engine.block(this.x + x, this.y, this.z + z);
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
}

export default RedstoneTorch;