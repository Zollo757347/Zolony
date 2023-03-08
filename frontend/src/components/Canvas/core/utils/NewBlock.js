import { AirBlock, IronBlock, GlassBlock, Lever, RedstoneDust, RedstoneLamp, RedstoneRepeater, RedstoneTorch } from "../blocks";
import BlockType from "./BlockType";

/**
 * 根據給定的方塊種類回傳對應的 constructor
 * @param {(typeof BlockType)[keyof typeof BlockType]} type 
 * @returns {new () => import("../blocks").Block}
 */
function NewBlock(type) {
  switch (type) {
    case BlockType.AirBlock:
      return AirBlock;
      
    case BlockType.IronBlock:
      return IronBlock;
      
    case BlockType.GlassBlock:
      return GlassBlock;
      
    case BlockType.Lever:
      return Lever;

    case BlockType.RedstoneDust:
      return RedstoneDust;
      
    case BlockType.RedstoneLamp:
      return RedstoneLamp;
      
    case BlockType.RedstoneRepeater:
      return RedstoneRepeater;
      
    case BlockType.RedstoneTorch:
      return RedstoneTorch;

    default: 
      throw new Error(`Unknown block type ${type}`);
  }
}

export default NewBlock;