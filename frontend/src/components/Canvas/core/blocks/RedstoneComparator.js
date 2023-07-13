import {
  comparator_on_subtract, comparator_on, comparator_subtract, comparator
} from "../../../../assets/json/blocks";
import { BlockType, Maps } from "../utils";
import Block from "./Block";

/**
 * @typedef _RedstoneComparatorStates
 * @type {object}
 * @property {string} facing 紅石中繼器的指向
 * @property {'compare' | 'subtract'} mode 紅石中繼器是否被鎖定
 * @property {boolean} powered 紅石中繼器是否被激發
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneComparatorStates} RedstoneComparatorStates
 */

/**
 * 代表一個紅石中繼器
 */
class RedstoneComparator extends Block {
  constructor(options) {
    super({ type: BlockType.RedstoneComparator, blockName: '紅石比較器', needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'full', ...options });
    
    /**
     * 此紅石中繼器的狀態
     * @type {RedstoneComparatorStates}
     */
    this.states = { ...(this.states ?? {}), facing: 'north', mode: 'compare', powered: false };

    this._model = {
      compare: [comparator, comparator_on], 
      subtract: [comparator_subtract, comparator_on_subtract]
    };

    /**
     * 紅石比較器一側的方向
     * @type {import("../utils/parseTexture").FourFacings}
     * @private
     */
    this._side = 'east';
  }

  get power() {
    return 0;
  }

  get textures() {
    return this._model[this.states.mode][this.states.powered ? 1 : 0][this.states.facing].textures;
  }

  get outlines() {
    return this._model[this.states.mode][this.states.powered ? 1 : 0][this.states.facing].outlines;
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsBlock(direction) {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: this.states.power } :
      { strong: false, power: 0 };
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsWire(direction) {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: this.states.power } :
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
    this.states.mode = this.states.mode === 'compare' ? 'subtract' : 'compare';
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

    let block = this.engine.block(this.x + rearX, this.y, this.z + rearZ);
    const rearPower = block?.powerTowardsWire(this.states.facing).power ?? 0;

    let sidePower = 0;
    block = this.engine.block(this.x + sideX, this.y, this.z + sideZ);
    if ([BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block?.type)) {
      sidePower = Math.max(sidePower, block?.powerTowardsWire(Maps.ReverseDir[this._side]).power ?? 0);
    }

    block = this.engine.block(this.x - sideX, this.y, this.z - sideZ);
    if ([BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block?.type)) {
      sidePower = Math.max(sidePower, block?.powerTowardsWire(this._side).power ?? 0);
    }

    let newPower = 0;
    if (this.states.mode === 'subtract') {
      newPower = Math.max(rearPower - sidePower, 0);
    }
    else {
      newPower = rearPower >= sidePower ? rearPower : 0;
    }

    if (this.states.power !== newPower) {
      this.engine.addTask('comparatorUpdate', [this.x, this.y, this.z, newPower], 2);
    }
  }

  /**
   * 更新此紅石中繼器的激發狀態
   * @param {number} power
   */
  comparatorUpdate(power) {
    const rear = Maps.P4DMap.get(Maps.ReverseDir[this.states.facing]);
    const side = Maps.P4DMap.get(this._side);
    if (!rear || !side) return;

    const [rearX, , rearZ] = rear;
    const [sideX, , sideZ] = side;

    let block = this.engine.block(this.x + rearX, this.y, this.z + rearZ);
    const rearPower = block?.powerTowardsWire(this.states.facing).power ?? 0;

    let sidePower = 0;
    block = this.engine.block(this.x + sideX, this.y, this.z + sideZ);
    if ([BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block?.type)) {
      sidePower = Math.max(sidePower, block?.powerTowardsWire(Maps.ReverseDir[this._side]).power ?? 0);
    }

    block = this.engine.block(this.x - sideX, this.y, this.z - sideZ);
    if ([BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block?.type)) {
      sidePower = Math.max(sidePower, block?.powerTowardsWire(this._side).power ?? 0);
    }

    let nowPower = 0;
    if (this.states.mode === 'subtract') {
      nowPower = Math.max(rearPower - sidePower, 0);
    }
    else {
      nowPower = rearPower >= sidePower ? rearPower : 0;
    }
    if (nowPower === this.states.power) {
      return;
    }

    this.states.power = power;
    this.states.powered = power > 0;
    this.sendPPUpdate();
  }
}

export default RedstoneComparator;