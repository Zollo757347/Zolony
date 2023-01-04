import { AirBlock, Concrete, GlassBlock, Lever, RedstoneDust, RedstoneLamp, RedstoneRepeater, RedstoneTorch } from "./Playground/Blocks";
import { BlockType } from "./Playground/BlockType";

class Utils extends null {
  /**
   * 遞迴地比較兩個變數是否完全相等，對於物件僅考慮可枚舉的屬性
   * @param {any} thing1
   * @param {any} thing2
   */
  static StrictEqual(thing1, thing2) {
    if (typeof thing1 === 'number' && typeof thing2 === 'number' && isNaN(thing1) && isNaN(thing2)) {
      return true;
    }
    if (typeof thing1 !== 'object' || typeof thing2 !== 'object') {
      return thing1 === thing2;
    }

    if (Object.keys(thing1).length !== Object.keys(thing2).length) {
      return false;
    }
    for (const key in thing1) {
      if (!this.StrictEqual(thing1[key], thing2[key])) {
        return false;
      }
    }
    return true;
  }

  static Sleep(ms, value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, ms);
    });
  }

  /**
   * 
   */
  static NewBlock(engine, type, x, y, z) {
    switch (type) {
      case BlockType.AirBlock:
        return new AirBlock({ x, y, z, engine });
        
      case BlockType.Concrete:
        return new Concrete({ x, y, z, engine });
        
      case BlockType.GlassBlock:
        return new GlassBlock({ x, y, z, engine });
        
      case BlockType.Lever:
        return new Lever({ x, y, z, engine });

      case BlockType.RedstoneDust:
        return new RedstoneDust({ x, y, z, engine });
        
      case BlockType.RedstoneLamp:
        return new RedstoneLamp({ x, y, z, engine });
        
      case BlockType.RedstoneRepeater:
        return new RedstoneRepeater({ x, y, z, engine });
        
      case BlockType.RedstoneTorch:
        return new RedstoneTorch({ x, y, z, engine });
        

      default: 
        throw new Error(`Unknown block type ${type}`);
    }
  }
}

export default Utils;