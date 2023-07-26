import { BlockOptions, BlockType, RedstoneTorchBaseStates, SixSides } from "../../typings/types";
import Block from "./Block";

abstract class RedstoneTorchBase extends Block {
  public type: BlockType.RedstoneTorch;
  public states: RedstoneTorchBaseStates;

  constructor(options: BlockOptions) {
    super({ needSupport: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    this.type = BlockType.RedstoneTorch;
    this.states = { power: 0, source: true, lit: true };
  }

  get power() {
    return this.states.lit ? 15 : 0;
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
   * 更新此紅石火把的明暗狀態
   */
  torchUpdate(lit: boolean) {
    this.states.lit = lit;
    this.states.source = lit;
    this.sendPPUpdate();
  }
}

export default RedstoneTorchBase;