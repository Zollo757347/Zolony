import { lever, lever_on } from "../../../../assets/json/blocks";
import { BlockType } from "../utils";
import Block from "./Block";

/**
 * @typedef _LeverStates
 * @type {object}
 * @property {'wall' | 'ceiling' | 'floor'} face 此控制桿的附著位置
 * @property {'east' | 'west' | 'south' | 'north'} facing 此控制桿的面向方向
 * @property {boolean} powered 此控制桿是否被拉下
 * 
 * @typedef {import("./Block").BlockStates & _LeverStates} LeverStates
 */

/**
 * 代表一個控制桿
 */
class Lever extends Block {
  constructor(options) {
    super({ type: BlockType.Lever, blockName: 'Lever', transparent: true, needSupport: true, interactable: true, redstoneAutoConnect: 'full', ...options });

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

  get textures() {
    return (this.states.powered ? this._model.powered : this._model.unpowered)[this.states.face][this.states.facing].textures;
  }

  get outlines() {
    return (this.states.powered ? this._model.powered : this._model.unpowered)[this.states.face][this.states.facing].outlines;
  }

  get power() {
    return this.states.powered ? 15 : 0;
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
    const table = {
      east: 'west', 
      west: 'east', 
      south: 'north', 
      north: 'south'
    };

    if (normDir === 'up') {
      this.states.face = 'floor';
      this.states.facing = table[facingDir];
    }
    else if (normDir === 'down') {
      this.states.face = 'ceiling';
      this.states.facing = table[facingDir];
    }
    else {
      this.states.face = 'wall';
      this.states.facing = normDir;
    }
  }

  PPUpdate() {
    let attachedBlock = null;
    let broken = false;
    switch (this.states.face) {
      case 'ceiling':
        attachedBlock = this.engine.block(this.x, this.y + 1, this.z);
        if (!attachedBlock?.bottomSupport) {
          broken = true;
        }
        break;

      case 'floor':
        attachedBlock = this.engine.block(this.x, this.y - 1, this.z);
        if (!attachedBlock?.upperSupport) {
          broken = true;
        }
        break;

      case 'wall':
        switch (this.states.facing) {
          case 'east':
            attachedBlock = this.engine.block(this.x - 1, this.y, this.z);
            if (!attachedBlock?.sideSupport) {
              broken = true;
            }
            break;
    
          case 'west':
            attachedBlock = this.engine.block(this.x + 1, this.y, this.z);
            if (!attachedBlock?.sideSupport) {
              broken = true;
            }
            break;
          
          case 'south':
            attachedBlock = this.engine.block(this.x, this.y, this.z - 1);
            if (!attachedBlock?.sideSupport) {
              broken = true;
            }
            break;
    
          case 'north':
            attachedBlock = this.engine.block(this.x, this.y, this.z + 1);
            if (!attachedBlock?.sideSupport) {
              broken = true;
            }
            break;

          default: break;
        }
        break;

      default: break;
    }

    if (broken) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
    }
  }
}

export default Lever;