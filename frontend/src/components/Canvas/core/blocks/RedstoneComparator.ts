import {
  comparator_on_subtract, comparator_on, comparator_subtract, comparator
} from "../../../../assets/json/blocks";
import { BlockOptions, BlockType, FourFacings, RedstoneComparatorStates, SixSides, Vector3, WebGLData } from "../../typings/types";
import { Maps } from "../utils";
import Block from "./Block";

/**
 * 代表一個紅石比較器
 */
class RedstoneComparator extends Block {
  public type: BlockType.RedstoneComparator;
  public states: RedstoneComparatorStates;

  constructor(options: BlockOptions) {
    super({ needBottomSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    this.type = BlockType.RedstoneComparator;
    this.states = { power: 0, source: false, facing: 'north', mode: 'compare', powered: false };

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

    const newPower = this.currentPower;
    if (this.states.power !== newPower) {
      this.engine.addTask(['comparatorUpdate', [this.x, this.y, this.z, newPower], 2]);
    }
  }

  /**
   * 更新此紅石中繼器的激發狀態
   * @param power
   */
  comparatorUpdate(power: number) {
    if (this.currentPower === this.states.power) {
      return;
    }

    this.states.power = power;
    this.states.powered = power > 0;
    this.sendPPUpdate();
  }

  private _left: FourFacings = 'east';
  private _right: FourFacings = 'west';
  private _backCoords: Vector3 = [this.x, this.y, this.z + 1];
  private _leftCoords: Vector3 = [this.x - 1, this.y, this.z];
  private _rightCoords: Vector3 = [this.x + 1, this.y, this.z];

  /**
   * 設定面向的方向
   * @param normDir 指定面的法向量方向
   * @param facingDir 與觀察視角最接近的軸向量方向
   */
  private setFacing(normDir?: SixSides, facingDir?: FourFacings) {
    if (!normDir || !facingDir) return;
    
    this.states.facing = facingDir ?? 'north';
    this._left = ({ north: 'east', east: 'south', south: 'west', west: 'north' } as const)[facingDir];
    this._right = ({ north: 'west', west: 'south', south: 'east', east: 'north' } as const)[facingDir];

    let x: number, y: number, z: number;
    [x, y, z] = Maps.P4DMap[Maps.ReverseDir[facingDir]];
    this._backCoords = [this.x + x, this.y + y, this.z + z];

    [x, y, z] = Maps.P4DMap[this._left];
    this._leftCoords = [this.x + x, this.y + y, this.z + z];

    [x, y, z] = Maps.P4DMap[this._right];
    this._rightCoords = [this.x + x, this.y + y, this.z + z];
  }

  /**
   * 取得比較器當下的輸出強度
   */
  private get currentPower() {
    const [bx, by, bz] = this._backCoords;
    const [lx, ly, lz] = this._leftCoords;
    const [rx, ry, rz] = this._rightCoords;

    let block = this.engine.block(bx, by, bz);
    const backPower = block?.powerTowardsWire(this.states.facing).power ?? 0;

    let sidePower = 0;
    block = this.engine.block(lx, ly, lz);
    if (block && [BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block.type)) {
      sidePower = Math.max(sidePower, block.powerTowardsWire(this._right).power ?? 0);
    }

    block = this.engine.block(rx, ry, rz);
    if (block && [BlockType.RedstoneDust, BlockType.RedstoneRepeater, BlockType.RedstoneComparator].includes(block.type)) {
      sidePower = Math.max(sidePower, block.powerTowardsWire(this._left).power ?? 0);
    }

    if (this.states.mode === 'subtract') {
      return Math.max(backPower - sidePower, 0);
    }
    else {
      return backPower >= sidePower ? backPower : 0;
    }
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