import {
  comparator_on_subtract, comparator_on, comparator_subtract, comparator
} from "../../../../assets/json/blocks";
import { BlockOptions, BlockType, FourFacings, RedstoneComparatorStates, SixSides, WebGLData } from "../../typings/types";
import { Maps } from "../utils";
import Block from "./Block";

/**
 * 代表一個紅石比較器
 */
class RedstoneComparator extends Block {
  public type: BlockType.RedstoneComparator;
  public blockName: string;
  public states: RedstoneComparatorStates;

  private _side: FourFacings;

  constructor(options: BlockOptions) {
    super({ needBottomSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    this.type = BlockType.RedstoneComparator;
    this.blockName = '紅石比較器';
    this.states = { power: 0, source: false, facing: 'north', mode: 'compare', powered: false };

    /** 紅石比較器一側的方向 */
    this._side = 'east';

    this.setFacing(options.normDir, options.facingDir);
  }

  get power() {
    return 0;
  }

  get supportingBlock() {
    return this.engine.block(this.x, this.y - 1, this.z);
  }

  get textures() {
    return _model[this.states.mode][this.states.powered ? 1 : 0][this.states.facing].textures;
  }

  get outlines() {
    return _model[this.states.mode][this.states.powered ? 1 : 0][this.states.facing].outlines;
  }

  powerTowardsBlock(direction: SixSides): { strong: boolean, power: number } {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: this.states.power } :
      { strong: false, power: 0 };
  }

  powerTowardsWire(direction: SixSides): { strong: boolean, power: number } {
    return this.states.powered && direction === this.states.facing ?
      { strong: true, power: this.states.power } :
      { strong: false, power: 0 };
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

    const rear = Maps.P4DMap[Maps.ReverseDir[this.states.facing]];
    const side = Maps.P4DMap[Maps.ReverseDir[this._side]];
    if (!rear || !side) return;

    const [rearX, , rearZ] = rear;
    const [sideX, , sideZ] = side;

    let block = this.engine.block(this.x + rearX, this.y, this.z + rearZ);
    const rearPower = block?.powerTowardsWire(this.states.facing).power ?? 0;

    let sidePower = 0;
    block = this.engine.block(this.x + sideX, this.y, this.z + sideZ);
    if (block && [BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block.type)) {
      sidePower = Math.max(sidePower, block.powerTowardsWire(Maps.ReverseDir[this._side]).power ?? 0);
    }

    block = this.engine.block(this.x - sideX, this.y, this.z - sideZ);
    if (block && [BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block.type)) {
      sidePower = Math.max(sidePower, block.powerTowardsWire(this._side).power ?? 0);
    }

    let newPower = 0;
    if (this.states.mode === 'subtract') {
      newPower = Math.max(rearPower - sidePower, 0);
    }
    else {
      newPower = rearPower >= sidePower ? rearPower : 0;
    }

    if (this.states.power !== newPower) {
      this.engine.addTask(['comparatorUpdate', [this.x, this.y, this.z, newPower], 2]);
    }
  }

  /**
   * 更新此紅石中繼器的激發狀態
   * @param power
   */
  comparatorUpdate(power: number) {
    const rear = Maps.P4DMap[Maps.ReverseDir[this.states.facing]];
    const side = Maps.P4DMap[Maps.ReverseDir[this._side]];
    if (!rear || !side) return;

    const [rearX, , rearZ] = rear;
    const [sideX, , sideZ] = side;

    let block = this.engine.block(this.x + rearX, this.y, this.z + rearZ);
    const rearPower = block?.powerTowardsWire(this.states.facing).power ?? 0;

    let sidePower = 0;
    block = this.engine.block(this.x + sideX, this.y, this.z + sideZ);
    if (block && [BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block.type)) {
      sidePower = Math.max(sidePower, block.powerTowardsWire(Maps.ReverseDir[this._side]).power ?? 0);
    }

    block = this.engine.block(this.x - sideX, this.y, this.z - sideZ);
    if (block && [BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block.type)) {
      sidePower = Math.max(sidePower, block.powerTowardsWire(this._side).power ?? 0);
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

  /**
   * 設定面向的方向
   * @param normDir 指定面的法向量方向
   * @param facingDir 與觀察視角最接近的軸向量方向
   */
  private setFacing(normDir?: SixSides, facingDir?: FourFacings) {
    if (!normDir || !facingDir) return;
    
    this.states.facing = facingDir ?? 'north';
    this._side = ['north', 'south'].includes(facingDir) ? 'east' : 'south';
  }
}

export default RedstoneComparator;

const _model: {
  compare: [Record<FourFacings, WebGLData>, Record<FourFacings, WebGLData>], 
  subtract: [Record<FourFacings, WebGLData>, Record<FourFacings, WebGLData>]
} = {
  compare: [comparator, comparator_on], 
  subtract: [comparator_subtract, comparator_on_subtract]
};