import { repeater_1tick } from "../../../../assets/json/blocks";
import { Axis, BlockType } from "../utils";
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
    super({ type: BlockType.RedstoneRepeater, blockName: 'Redstone Repeater', needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'lined', ...options });
    
    /**
     * 此紅石中繼器的狀態
     * @type {RedstoneRepeaterStates}
     */
    this.states = { ...(this.states ?? {}), delay: 1, facing: 'north', locked: false, powered: false };

    this.outlines = repeater_1tick.outlines;
    this.textures = repeater_1tick.textures;
  }

  get power() {
    return 0;
  }

  /**
   * 設定中繼器面向的方向
   * @param {symbol} normDir 指定面的法向量方向
   * @param {symbol} facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir, facingDir) {
    switch (facingDir) {
      case Axis.PX:
        this.states.facing = 'east';
        return;

      case Axis.NX:
        this.states.facing = 'west';
        return;

      case Axis.PZ:
        this.states.facing = 'south';
        return;

      case Axis.NZ:
        this.states.facing = 'north';
        return;

      default:
        this.states.facing = 'north';
        return;
    }
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
    if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
    }

    let x, y, z, sx, sy, sz, ds, dr;
    switch (this.states.facing) {
      case 'west':
        [x, y, z] = [1, 0, 0];
        [sx, sy, sz, ds, dr] = [0, 0, 1, 'north', 'south'];
        break;
      
      case 'east':
        [x, y, z] = [-1, 0, 0];
        [sx, sy, sz, ds, dr] = [0, 0, 1, 'north', 'south'];
        break;

      case 'north':
        [x, y, z] = [0, 0, 1];
        [sx, sy, sz, ds, dr] = [1, 0, 0, 'west', 'east'];
        break;

      case 'south':
        [x, y, z] = [0, 0, -1];
        [sx, sy, sz, ds, dr] = [1, 0, 0, 'west', 'east'];
        break;

      default:
        throw new Error(`${this.states.facing} is not a valid direction.`);
    }

    const oldPowered = this.states.powered;
    const oldLocked = this.states.locked;
    let newPowered = false, newLocked = false;
    let block = this.engine.block(this.x + x, this.y + y, this.z + z);
    if (block && (block.power || (block.type === BlockType.RedstoneRepeater && block.states.facing === this.states.facing && block.states.powered))) {
      newPowered = true;
    }

    block = this.engine.block(this.x + sx, this.y + sy, this.z + sz);
    if (block && block.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === ds) {
      newLocked = true;
    }

    block = this.engine.block(this.x - sx, this.y - sy, this.z - sz);
    if (block && block.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === dr) {
      newLocked = true;
    }

    if (!newLocked && oldPowered !== newPowered) {
      this.engine.addTask('repeaterUpdate', [this.x, this.y, this.z, newPowered], this.states.delay * 2);
    }
    if (oldLocked !== newLocked) {
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
      let x, y, z;
      switch (this.states.facing) {
        case 'west':
          [x, y, z] = [1, 0, 0];
          break;
        
        case 'east':
          [x, y, z] = [-1, 0, 0];
          break;
  
        case 'north':
          [x, y, z] = [0, 0, 1];
          break;
  
        case 'south':
          [x, y, z] = [0, 0, -1];
          break;
  
        default:
          throw new Error(`${this.states.facing} is not a valid direction.`);
      }
      
      const block = this.engine.block(this.x + x, this.y + y, this.z + z);
      if (block && (block.power || (block.type === BlockType.RedstoneRepeater && block.states.facing === this.states.facing && block.states.powered))) {
        return;
      }
    }

    this.states.powered = powered;
    this.sendPPUpdate();
  }
}

export default RedstoneRepeater;