import { lever, lever_on } from "../../../../assets/json/blocks";
import { BlockType, Maps } from "../utils";
import Block from "./Block";

/**
 * @typedef _LeverStates
 * @type {object}
 * @property {'wall' | 'ceiling' | 'floor'} face 此控制桿的附著位置
 * @property {import("../utils/parseTexture").FourFacings} facing 此控制桿的面向方向
 * @property {boolean} powered 此控制桿是否被拉下
 * 
 * @typedef {import("./Block").BlockStates & _LeverStates} LeverStates
 */

/**
 * 代表一個控制桿
 */
class Lever extends Block {
  constructor(options) {
    super({ type: BlockType.Lever, blockName: '控制桿', transparent: true, needSupport: true, interactable: true, redstoneAutoConnect: 'full', ...options });

    this._model = {
      powered: lever_on, 
      unpowered: lever
    }

    /**
     * 此控制桿的狀態
     * @type {LeverStates}
     */
    this.states = { ...(this.states ?? {}), face: 'wall', facing: 'north', powered: false };
  }

  get power() {
    return this.states.powered ? 15 : 0;
  }

  get textures() {
    return (this.states.powered ? this._model.powered : this._model.unpowered)[this.states.face][this.states.facing].textures;
  }

  get outlines() {
    return (this.states.powered ? this._model.powered : this._model.unpowered)[this.states.face][this.states.facing].outlines;
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsBlock(direction) {
    return (
      (this.states.face === 'ceiling' && direction === 'up') ||
      (this.states.face === 'floor' && direction === 'down') ||
      (this.states.face === 'wall' && this.states.facing === direction)
    ) ?
    { strong: true, power: 15 } :
    { strong: false, power: 0 };
  }

  /**
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsWire(direction) {
    return { strong: this.states.powered, power: this.states.powered ? 15 : 0 };
  }

  interact() {
    this.states.powered = !this.states.powered;
    this.states.source = this.states.powered;
    this.sendPPUpdate();
  }

  /**
   * 設定控制桿面向的方向
   * @param {symbol} normDir 指定面的法向量方向
   * @param {symbol} facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir, facingDir) {
    if (normDir === 'up') {
      this.states.face = 'floor';
      this.states.facing = Maps.ReverseDir[facingDir];
    }
    else if (normDir === 'down') {
      this.states.face = 'ceiling';
      this.states.facing = Maps.ReverseDir[facingDir];
    }
    else {
      this.states.face = 'wall';
      this.states.facing = normDir;
    }
  }
}

export default Lever;