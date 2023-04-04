import {
  redstone_torch_off, redstone_torch, redstone_wall_torch_off, redstone_wall_torch
} from "../../../../assets/json/blocks";
import { BlockType } from "../utils";
import Block from "./Block";

/**
 * @typedef _RedstoneTorchStates
 * @type {object}
 * @property {boolean} lit 此紅石火把是否被觸發
 * @property {'north' | 'south' | 'west' | 'east' | 'up'} facing 此紅石火把面向的方向
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneTorchStates} RedstoneTorchStates
 */

class RedstoneTorch extends Block {
  constructor(options) {
    super({ type: BlockType.RedstoneTorch, blockName: 'Redstone Torch', needSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

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
    let attachedBlock = null;
    let broken = false;
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
      
      default:
        attachedBlock = this.engine.block(this.x, this.y - 1, this.z);
        if (!attachedBlock?.upperSupport) {
          broken = true;
        }
        break;
    }

    if (broken) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
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