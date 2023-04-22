import { BlockType, Maps } from "../utils";
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
      const poweredByLever = Maps.P6DArray.some(([dir, [x, y, z]]) => {
        block = this.engine.block(this.x + x, this.y + y, this.z + z);
        return block?.type === BlockType.Lever && block.states.powered 
          && (block.states.facing === dir || (dir === 'down' && block.states.face === 'ceiling') || (dir === 'up' && block.states.face === 'floor'));
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
        Maps.P4DArray.forEach(([dir, [x, _, z]]) => {
          block = this.engine.block(this.x + x, this.y, this.z + z);
  
          // 側邊方塊是指向自己的紅石粉，弱充能至相同等級
          if (block?.type === BlockType.RedstoneDust && block.states[Maps.ReverseDir[dir]]) {
            power = Math.max(power, block.power);
          }
  
          // 側邊方塊是指向自己的紅石中繼器，強充能至 15
          else if (block?.type === BlockType.RedstoneRepeater && block.states.powered && block.states.facing === Maps.ReverseDir[dir]) {
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