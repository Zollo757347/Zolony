import { BlockType } from "../../typings/types";

const blockNameTable: { [K in BlockType]: string } = {
  [BlockType.AirBlock]: '空氣', 
  [BlockType.IronBlock]: '鐵方塊', 
  [BlockType.GlassBlock]: '玻璃', 
  [BlockType.RedstoneDust]: '紅石粉', 
  [BlockType.RedstoneTorch]: '紅石火把', 
  [BlockType.RedstoneRepeater]: '紅石中繼器', 
  [BlockType.RedstoneLamp]: '紅石燈', 
  [BlockType.Lever]: '控制桿', 
  [BlockType.RedstoneComparator]: '紅石比較器'
};

export default blockNameTable;