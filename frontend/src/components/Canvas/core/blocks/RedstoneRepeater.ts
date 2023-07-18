import {
  repeater_1tick_locked, repeater_1tick_on_locked, repeater_1tick_on, repeater_1tick, 
  repeater_2tick_locked, repeater_2tick_on_locked, repeater_2tick_on, repeater_2tick, 
  repeater_3tick_locked, repeater_3tick_on_locked, repeater_3tick_on, repeater_3tick, 
  repeater_4tick_locked, repeater_4tick_on_locked, repeater_4tick_on, repeater_4tick
} from "../../../../assets/json/blocks";
import { BlockOptions, BlockType, FourFacings, RedstoneRepeaterStates, SixSides, WebGLData } from "../../typings/types";
import { Maps } from "../utils";
import Block from "./Block";

/**
 * 代表一個紅石中繼器
 */
class RedstoneRepeater extends Block {
  public type: BlockType.RedstoneRepeater;
  public blockName: string;
  public states: RedstoneRepeaterStates;

  private _side: FourFacings;

  constructor(options: BlockOptions) {
    super({ needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'line', ...options });
    
    this.type = BlockType.RedstoneRepeater;
    this.blockName = '紅石中繼器';
    this.states = { power: 0, source: false, delay: 1, facing: 'north', locked: false, powered: false };

    /** 紅石中繼器一側的方向 */
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
    return _model[index][this.states.facing].textures;
  }

  get outlines() {
    const index = 
      (this.states.powered ? 8 : 0) +
      (this.states.locked ? 4 : 0) +
      this.states.delay - 1;
    return _model[index][this.states.facing].outlines;
  }

  powerTowardsBlock(direction: SixSides): { strong: boolean, power: number } {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: 15 } :
      { strong: false, power: 0 };
  }

  powerTowardsWire(direction: SixSides): { strong: boolean, power: number } {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: 15 } :
      { strong: false, power: 0 };
  }

  /**
   * 設定中繼器面向的方向
   * @param normDir 指定面的法向量方向
   * @param facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(_normDir: SixSides, facingDir: FourFacings) {
    this.states.facing = facingDir ?? 'north';
    this._side = ['north', 'south'].includes(facingDir) ? 'east' : 'south';
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

    const rear = Maps.P4DMap[Maps.ReverseDir[this.states.facing]];
    const side = Maps.P4DMap[this._side];
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
      this.engine.addTask(['repeaterUpdate', [this.x, this.y, this.z, newPowered], this.states.delay * 2]);
    }
    if (this.states.locked !== newLocked) {
      this.states.locked = newLocked;
      this.sendPPUpdate();
    }
  }

  /**
   * 更新此紅石中繼器的激發狀態
   */
  repeaterUpdate(powered: boolean) {
    if (!powered) {
      const rear = Maps.P4DMap[Maps.ReverseDir[this.states.facing]];
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

const _model: Record<FourFacings, WebGLData>[] = [
  repeater_1tick,           repeater_2tick,           repeater_3tick,           repeater_4tick, 
  repeater_1tick_locked,    repeater_2tick_locked,    repeater_3tick_locked,    repeater_4tick_locked, 
  repeater_1tick_on,        repeater_2tick_on,        repeater_3tick_on,        repeater_4tick_on, 
  repeater_1tick_on_locked, repeater_2tick_on_locked, repeater_3tick_on_locked, repeater_4tick_on_locked
];