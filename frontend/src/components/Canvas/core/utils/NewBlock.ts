import { BlockConstructor, BlockType } from "../../typings/types";
import { AirBlock, IronBlock, GlassBlock, Lever, RedstoneDust, RedstoneLamp, RedstoneRepeater, RedstoneTorch, RedstoneComparator } from "../blocks";

/**
 * 根據給定的方塊種類回傳對應的 constructor
 */
function NewBlock(type: BlockType): BlockConstructor {
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
      
      case BlockType.RedstoneComparator:
        return RedstoneComparator;
      
    case BlockType.RedstoneTorch:
      return RedstoneTorch;
  }
}

export default NewBlock;