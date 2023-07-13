import {
  repeater_1tick_locked, repeater_1tick_on_locked, repeater_1tick_on, repeater_1tick, 
  repeater_2tick_locked, repeater_2tick_on_locked, repeater_2tick_on, repeater_2tick, 
  repeater_3tick_locked, repeater_3tick_on_locked, repeater_3tick_on, repeater_3tick, 
  repeater_4tick_locked, repeater_4tick_on_locked, repeater_4tick_on, repeater_4tick
} from "../../../../assets/json/blocks";
import { BlockType, Maps } from "../utils";
import Block from "./Block";

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
    super({ type: BlockType.RedstoneRepeater, blockName: '紅石中繼器', needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'lined', ...options });
    
    /**
     * 此紅石中繼器的狀態
     * @type {RedstoneRepeaterStates}
     */
    this.states = { ...(this.states ?? {}), delay: 1, facing: 'north', locked: false, powered: false };

    this._model = [
      repeater_1tick,           repeater_2tick,           repeater_3tick,           repeater_4tick, 
      repeater_1tick_locked,    repeater_2tick_locked,    repeater_3tick_locked,    repeater_4tick_locked, 
      repeater_1tick_on,        repeater_2tick_on,        repeater_3tick_on,        repeater_4tick_on, 
      repeater_1tick_on_locked, repeater_2tick_on_locked, repeater_3tick_on_locked, repeater_4tick_on_locked
    ];

    /**
     * 紅石中繼器一側的方向
     * @type {import("../utils/parseTexture").FourFacings}
     * @private
     */
    this._side = 'east';
  }

  get power() {
    return 0;
  }

  get textures() {
    const index = 
      (this.states.powered ? 8 : 0) +
      (this.states.locked ? 4 : 0) +
      this.states.delay - 1;
    return this._model[index][this.states.facing].textures;
  }

  get outlines() {
    const index = 
      (this.states.powered ? 8 : 0) +
      (this.states.locked ? 4 : 0) +
      this.states.delay - 1;
    return this._model[index][this.states.facing].outlines;
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsBlock(direction) {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: 15 } :
      { strong: false, power: 0 };
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: strong, power: number }}
   */
  powerTowardsWire(direction) {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: 15 } :
      { strong: false, power: 0 };
  }

  /**
   * 設定中繼器面向的方向
   * @param {symbol} normDir 指定面的法向量方向
   * @param {symbol} facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir, facingDir) {
    this.states.facing = facingDir ?? 'north';
    this._sides = ['north', 'south'].includes(facingDir) ? 'east' : 'south';
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
    super.PPUpdate();

    const rear = Maps.P4DMap.get(Maps.ReverseDir[this.states.facing]);
    const side = Maps.P4DMap.get(this._side);
    if (!rear || !side) return;

    const [rearX, , rearZ] = rear;
    const [sideX, , sideZ] = side;

    let newPowered = false, newLocked = false;
    let block = this.engine.block(this.x + rearX, this.y, this.z + rearZ);
    if (block?.powerTowardsWire(this.states.facing).power) {
      newPowered = true;
    }

    block = this.engine.block(this.x + sideX, this.y, this.z + sideZ);
    if (block?.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === Maps.ReverseDir[this._side]) {
      newLocked = true;
    }

    block = this.engine.block(this.x - sideX, this.y, this.z - sideZ);
    if (block?.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === this._side) {
      newLocked = true;
    }

    if (!newLocked && this.states.powered !== newPowered) {
      this.engine.addTask('repeaterUpdate', [this.x, this.y, this.z, newPowered], this.states.delay * 2);
    }
    if (this.states.locked !== newLocked) {
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
      const rear = Maps.P4DMap.get(Maps.ReverseDir[this.states.facing]);
      if (!rear) return;
  
      const [rearX, , rearZ] = rear;
      const block = this.engine.block(this.x + rearX, this.y, this.z + rearZ);
      if (block?.powerTowardsWire(this.states.facing).power) {
        return;
      }
    }

    this.states.powered = powered;
    this.sendPPUpdate();
  }
}

export default RedstoneRepeater;