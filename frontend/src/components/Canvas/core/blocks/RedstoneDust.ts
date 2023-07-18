import {
  redstone_dust_dot, redstone_dust_side0, redstone_dust_side1, redstone_dust_side_alt0, redstone_dust_side_alt1, redstone_dust_up
} from "../../../../assets/json/blocks";
import { Maps } from "../utils";
import Block from "./Block";
import { strictEqual } from "../../../../utils";
import { BlockOptions, BlockType, FourFacings, RedstoneDustStates, SixSides, WebGLTextureData } from "../../typings/types";

/**
 * 代表一個紅石粉方塊
 */
class RedstoneDust extends Block {
  public type: BlockType.RedstoneDust;
  public blockName: string;
  public states: RedstoneDustStates;

  public crossMode: boolean;

  constructor(options: BlockOptions) {
    super({ needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'full', ...options });

    this.type = BlockType.RedstoneDust;
    this.blockName = '紅石粉';
    this.states = { power: 0, source: false, east: 1, south: 1, west: 1, north: 1 };

    /** 此紅石粉閒置時是否處於向四周充能的狀態 */
    this.crossMode = true;
  }

  get power() {
    return this.states.power;
  }

  get color() {
    return [105 + 10 * this.states.power, 0, 0];
  }

  get textures() {
    const { east: e, west: w, south: s, north: n } = this.states;
    return [
      ..._textureModel.north[n], 
      ..._textureModel.west[w], 
      ..._textureModel.south[s], 
      ..._textureModel.east[e], 
      ...(!s === !e || !n === !w || !n !== !s ? _textureModel.dot : [])
    ];
  }

  get outlines() {
    const { east: e, west: w, south: s, north: n } = this.states;
    return [
      ..._outlineModel.north[n], 
      ..._outlineModel.west[w], 
      ..._outlineModel.south[s], 
      ..._outlineModel.east[e], 
      ...(!s === !e || !n === !w || !n !== !s ? _outlineModel.dot : [])
    ];
  }

  powerTowardsBlock(direction: SixSides): { strong: boolean, power: number } {
    if (direction === 'up') return { strong: false, power: 0 };
    return direction === 'down' || this.states[direction] ?
      { strong: false, power: this.states.power } :
      { strong: false, power: 0 };
  }

  powerTowardsWire(direction: SixSides): { strong: boolean, power: number } {
    if (direction === 'up' || direction === 'down') return { strong: false, power: 0 };
    return this.states[direction] ?
      { strong: true, power: this.states.power } :
      { strong: false, power: 0 };
  }

  /**
   * 與此紅石粉互動一次
   */
  interact() {
    this.crossMode = !this.crossMode;
    this.sendPPUpdate();
  }

  sendPPUpdate() {
    this.engine.needRender = true;
    
    this.PPUpdate();
    Maps.P6DArray.forEach(([dir, [x, y, z]]) => {
      const target = this.engine.block(this.x + x, this.y + y, this.z + z);
      if (!target) return;

      target.PPUpdate();

      if (dir === 'up' || dir === 'down') return;

      // 如果有指向側邊，側邊的上下兩個方塊也要更新
      if (this.states[dir] && target.type !== BlockType.RedstoneDust) {
        this.engine.block(this.x + x, this.y + y - 1, this.z + z)?.PPUpdate();
        this.engine.block(this.x + x, this.y + y + 1, this.z + z)?.PPUpdate();
      }
    });
  }

  // temprarily take PP and NC update as the same
  PPUpdate() {
    super.PPUpdate();
    
    this._changeShape();
    this._changePower();
  }


  /**
   * 更新自身的指向
   */
  private _changeShape() {
    const oldStates = JSON.parse(JSON.stringify(this.states));

    Maps.P4DArray.forEach(([dir, [dx, _, dz]]) => {
      const rdir = Maps.ReverseDir[dir];
      this.states[dir] = 0;
      const x = this.x + dx, z = this.z + dz;
      const block = this.engine.block(x, this.y, z);

      if (block?.redstoneAutoConnect) {
        if (
          block.redstoneAutoConnect === 'full' || (
            block.redstoneAutoConnect === 'line' &&
            'facing' in block.states &&
            block.states.facing !== 'up' &&
            [dir, rdir].includes(block.states.facing))
        ) {
          this.states[dir] = 1;
        }
      }

      if (this.engine.block(x, this.y - 1, z)?.type === BlockType.RedstoneDust && this.engine.block(x, this.y, z)?.transparent) {
        this.states[dir] = 1;
      }
      if (this.engine.block(x, this.y + 1, z)?.type === BlockType.RedstoneDust && this.engine.block(this.x, this.y + 1, this.z)?.transparent) {
        this.states[dir] = 2;
      }
    });

    const explicitDir = Maps.P4DArray
      .map(([dir]) => this.states[dir] ? dir : undefined)
      .filter(a => a) as FourFacings[];
    
    if (explicitDir.length === 0) {
      if (this.crossMode) {
        this.states.east = this.states.south = this.states.west = this.states.north = 1;
      }
    }
    else {
      this.crossMode = true;
      if (explicitDir.length === 1) {
        const rdir = Maps.ReverseDir[explicitDir[0]];
        if (!rdir) {
          throw new Error(`${explicitDir[0]} is not a valid direction.`);
        }
        this.states[rdir] = 1;
      }
    }

    if (!strictEqual(oldStates, this.states)) {
      this.sendPPUpdate();
    }
  }

  /**
   * 更新自身的充能強度
   */
  private _changePower() {
    const oldPower = this.states.power;
    let newPower = 0;

    Maps.P6DArray.forEach(([dir, [x, y, z]]) => {
      const block = this.engine.block(this.x + x, this.y + y, this.z + z);
      if (!block) return;

      let { strong, power } = block.powerTowardsWire(Maps.ReverseDir[dir]);
      if (!strong) return;

      if (block.type === BlockType.RedstoneDust) {
        power--;
      }
      newPower = Math.max(newPower, power);
    });

    Maps.P4DArray.forEach(([_, [x, __, z]]) => {
      const sideDown = this.engine.block(this.x + x, this.y - 1, this.z + z);
      const sideHori = this.engine.block(this.x + x, this.y, this.z + z);
      const sideUp = this.engine.block(this.x + x, this.y + 1, this.z + z);
      const above = this.engine.block(this.x, this.y + 1, this.z);

      if (sideHori?.transparent && sideDown?.type === BlockType.RedstoneDust) {
        newPower = Math.max(newPower, sideDown.power - 1);
      }

      if (above?.transparent && sideUp?.type === BlockType.RedstoneDust) {
        newPower = Math.max(newPower, sideUp.power - 1);
      }
    });

    this.states.power = newPower;
    if (oldPower !== newPower) {
      this.sendPPUpdate();
    }
  }
}


const _textureModel: {
  dot: WebGLTextureData[], 
  north: [WebGLTextureData[], WebGLTextureData[], WebGLTextureData[]], 
  west: [WebGLTextureData[], WebGLTextureData[], WebGLTextureData[]], 
  south: [WebGLTextureData[], WebGLTextureData[], WebGLTextureData[]], 
  east: [WebGLTextureData[], WebGLTextureData[], WebGLTextureData[]]
} = {
  dot: redstone_dust_dot.textures, 
  north: [
    [], 
    redstone_dust_side0.textures, 
    redstone_dust_side0.textures.concat(redstone_dust_up.north.textures)
  ], 
  west: [
    [], 
    redstone_dust_side1.textures, 
    redstone_dust_side1.textures.concat(redstone_dust_up.west.textures)
  ], 
  south: [
    [], 
    redstone_dust_side_alt0.textures, 
    redstone_dust_side_alt0.textures.concat(redstone_dust_up.south.textures)
  ], 
  east: [
    [], 
    redstone_dust_side_alt1.textures, 
    redstone_dust_side_alt1.textures.concat(redstone_dust_up.east.textures)
  ]
};

const _outlineModel: {
  dot: number[], 
  north: [number[], number[], number[]], 
  west: [number[], number[], number[]], 
  south: [number[], number[], number[]], 
  east: [number[], number[], number[]]
} = {
  dot: redstone_dust_dot.outlines, 
  north: [
    [], 
    redstone_dust_side0.outlines, 
    redstone_dust_side0.outlines.concat(redstone_dust_up.north.outlines)
  ], 
  west: [
    [], 
    redstone_dust_side1.outlines, 
    redstone_dust_side1.outlines.concat(redstone_dust_up.west.outlines)
  ], 
  south: [
    [], 
    redstone_dust_side_alt0.outlines, 
    redstone_dust_side_alt0.outlines.concat(redstone_dust_up.south.outlines)
  ], 
  east: [
    [], 
    redstone_dust_side_alt1.outlines, 
    redstone_dust_side_alt1.outlines.concat(redstone_dust_up.east.outlines)
  ]
};

export default RedstoneDust;