import {
  redstone_torch_off, redstone_torch, redstone_wall_torch_off, redstone_wall_torch
} from "../../../../assets/json/blocks";
import { BlockOptions, BlockType, FourFacings, RedstoneTorchStates, SixSides, WebGLData } from "../../typings/types";
import { Maps } from "../utils";
import Block from "./Block";

class RedstoneTorch extends Block {
  public type: BlockType.RedstoneTorch;
  public blockName: string;
  public states: RedstoneTorchStates;

  constructor(options: BlockOptions) {
    super({ needSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    this.type = BlockType.RedstoneTorch;
    this.blockName = '紅石火把';
    this.states = { power: 0, source: true, lit: true, facing: 'up' };
  }

  get power() {
    return this.states.lit ? 15 : 0;
  }

  get textures() {
    return this.states.facing === 'up' ?
      _model.floor[+this.states.lit].textures : 
      _model.wall[+this.states.lit][this.states.facing].textures;
  }

  get outlines() {
    return this.states.facing === 'up' ?
      _model.floor[+this.states.lit].outlines : 
      _model.wall[+this.states.lit][this.states.facing].outlines;
  }

  powerTowardsBlock(direction: SixSides): { strong: boolean, power: number } {
    return direction === 'up' && this.states.lit ?
      { strong: true, power: 15 } :
      { strong: false, power: 0 };
  }

  powerTowardsWire(): { strong: boolean, power: number } {
    return { strong: this.states.lit, power: this.states.lit ? 15 : 0 };
  }

  /**
   * 設定紅石火把面向的方向
   * @param normDir 指定面的法向量方向
   * @param facingDir 與觀察視角最接近的軸向量方向
   */
  setFacing(normDir: SixSides, _facingDir: FourFacings) {
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
      const dir = Maps.P4DMap[Maps.ReverseDir[this.states.facing]];
      if (!dir) {
        throw new Error(`${this.states.facing} is not a valid direction.`);
      }

      const [x, , z] = dir;
      attachedBlock = this.engine.block(this.x + x, this.y, this.z + z);
    }

    if (!attachedBlock?.states.power !== this.states.lit) {
      this.engine.addTask(['torchUpdate', [this.x, this.y, this.z, !attachedBlock?.states.power], 2]);
    }
  }

  /**
   * 更新此紅石火把的明暗狀態
   */
  torchUpdate(lit: boolean) {
    this.states.lit = lit;
    this.states.source = lit;
    this.sendPPUpdate();
  }
}

export default RedstoneTorch;

const _model: {
  wall: Record<FourFacings, WebGLData>[];
  floor: WebGLData[];
} = {
  wall: [redstone_wall_torch_off, redstone_wall_torch], 
  floor: [redstone_torch_off, redstone_torch]
};