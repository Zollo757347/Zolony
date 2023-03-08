import { Axis, BlockType } from "../utils";
import Block from "./Block";

/**
 * 代表一個單位方塊
 * @abstract
 */
class FullBlock extends Block {
  constructor(options) {
    super({ fullBlock: true, fullSupport: true, ...options });
  }

  /**
   * 更新自身狀態
   */
  PPUpdate() {
    const oldPower = this.states.power;
    const oldSource = this.states.source;

    let power = 0, source = false;
    let block = this.engine.block(this.x, this.y - 1, this.z);

    // 下方的方塊是點亮的紅石火把，強充能至 15
    if (block?.type === BlockType.RedstoneTorch && block.states.lit) {
      power = 15;
      source = true;
    }

    else {
      const poweredByLever = [
        [Axis.PX, 'wall', 'east'], 
        [Axis.PY, 'floor', 'north'], 
        [Axis.PZ, 'wall', 'south'], 
        [Axis.NX, 'wall', 'west'], 
        [Axis.NY, 'ceiling', 'north'], 
        [Axis.NZ, 'wall', 'north']
      ].some(([dir, face, facing]) => {
        const norm = Axis.VECTOR[dir];
        block = this.engine.block(this.x + norm.x, this.y + norm.y, this.z + norm.z);
        return block?.type === BlockType.Lever && block.states.face === face && block.states.facing === facing && block.states.powered;
      });
      if (poweredByLever) {
        power = 15;
        source = true;
      }
      
      else {
        block = this.engine.block(this.x, this.y + 1, this.z);

        // 上方的方塊是紅石粉，弱充能至相同等級
        if (block?.type === BlockType.RedstoneDust) {
          power = Math.max(power, block.power);
        }
  
        // 判斷側邊的方塊
        [[1, 0, 'west'], [-1, 0, 'east'], [0, 1, 'north'], [0, -1, 'south']].forEach(([dx, dz, dir]) => {
          block = this.engine.block(this.x + dx, this.y, this.z + dz);
  
          // 側邊方塊是指向自己的紅石粉，弱充能至相同等級
          if (block?.type === BlockType.RedstoneDust && block.states[dir]) {
            power = Math.max(power, block.power);
          }
  
          // 側邊方塊是指向自己的紅石中繼器，強充能至 15
          else if (block?.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === dir) {
            power = 15;
            source = true;
          }
        });
      }
    }

    this.states.power = power;
    this.states.source = source;

    if (oldPower !== this.states.power || oldSource !== this.states.source) {
      this.sendPPUpdate();
    }
  }
}

export default FullBlock;