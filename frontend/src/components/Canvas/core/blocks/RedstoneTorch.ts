import { redstone_torch_off, redstone_torch } from "../../../../assets/json/blocks";
import { BlockOptions, RedstoneTorchStates, WebGLData } from "../../typings/types";
import RedstoneTorchBase from "./RedstoneTorchBase";

class RedstoneTorch extends RedstoneTorchBase {
  public states: RedstoneTorchStates;

  constructor(options: BlockOptions) {
    super({ needSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    this.states = { power: 0, source: true, lit: true };
  }

  get power() {
    return this.states.lit ? 15 : 0;
  }

  get supportingBlock() {
    return this.engine.block(this.x, this.y - 1, this.z);
  }

  get textures() {
    return _model[+this.states.lit].textures;
  }

  get outlines() {
    return _model[+this.states.lit].outlines;
  }

  /**
   * 根據 Post Placement Update 的來源方向更新自身狀態
   */
  PPUpdate() {
    super.PPUpdate();
    
    const attachedBlock = this.engine.block(this.x, this.y - 1, this.z);

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

const _model: [WebGLData, WebGLData] = [redstone_torch_off, redstone_torch];