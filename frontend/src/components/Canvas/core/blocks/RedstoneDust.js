import {
  redstone_dust_dot, redstone_dust_side0, redstone_dust_side1, redstone_dust_side_alt0, redstone_dust_side_alt1, redstone_dust_up
} from "../../../../assets/json/blocks";
import { BlockType, Maps } from "../utils";
import Block from "./Block";
import { strictEqual } from "../../../../utils";

/**
 * @typedef _RedstoneDustStates
 * @type {object}
 * @property {number} east 紅石粉東側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} south 紅石粉南側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} west 紅石粉西側的連接狀態，0 為無，1 為有，2 為有且向上
 * @property {number} north 紅石粉北側的連接狀態，0 為無，1 為有，2 為有且向上
 * 
 * @typedef {import("./Block").BlockStates & _RedstoneDustStates} RedstoneDustStates
 */

/**
 * 代表一個紅石粉方塊
 */
class RedstoneDust extends Block {
  constructor(options) {
    super({ type: BlockType.RedstoneDust, blockName: '紅石粉', needBottomSupport: true, interactable: true, transparent: true, redstoneAutoConnect: 'full', ...options });
    
    /**
     * 此紅石粉的狀態
     * @type {RedstoneDustStates}
     */
    this.states = { ...(this.states ?? {}), east: 1, south: 1, west: 1, north: 1, power: 0, source: true };

    /**
     * 此紅石粉閒置時是否處於向四周充能的狀態
     * @type {boolean}
     */
    this.crossMode = true;

    this._textureModel = {
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

    this._outlineModel = {
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
  }

  get power() {
    return this.states.power;
  }

  get textures() {
    const { east: e, west: w, south: s, north: n } = this.states;
    return [
      ...this._textureModel.north[n], 
      ...this._textureModel.west[w], 
      ...this._textureModel.south[s], 
      ...this._textureModel.east[e], 
      ...(!s === !e || !n === !w || !n !== !s ? this._textureModel.dot : [])
    ];
  }

  get color() {
    return [105 + 10 * this.states.power, 0, 0];
  }

  get outlines() {
    const { east: e, west: w, south: s, north: n } = this.states;
    return [
      ...this._outlineModel.north[n], 
      ...this._outlineModel.west[w], 
      ...this._outlineModel.south[s], 
      ...this._outlineModel.east[e], 
      ...(!s === !e || !n === !w || !n !== !s ? this._outlineModel.dot : [])
    ];
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
      target?.PPUpdate();

      // 如果有指向側邊，側邊的上下兩個方塊也要更新
      if (this.states[dir] && target?.type !== BlockType.RedstoneDust) {
        this.engine.block(this.x + x, this.y + y - 1, this.z + z)?.PPUpdate();
        this.engine.block(this.x + x, this.y + y + 1, this.z + z)?.PPUpdate();
      }
    });
  }

  // temprarily take PP and NC update as the same
  PPUpdate() {
    this._changeShape();
    this._changePower();
  }


  /**
   * 更新自身的指向
   * @private
   */
  _changeShape() {
    const oldStates = JSON.parse(JSON.stringify(this.states));

    if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
      this.engine._leftClick(this.x, this.y, this.z);
      return;
    }

    Maps.P4DArray.forEach(([dir, [dx, _, dz]]) => {
      const rdir = Maps.ReverseDir[dir];
      this.states[dir] = 0;
      const x = this.x + dx, z = this.z + dz;
      const block = this.engine.block(x, this.y, z);

      if (block?.redstoneAutoConnect) {
        if (block.redstoneAutoConnect === 'full' || (block.redstoneAutoConnect === 'lined' && [dir, rdir].includes(block.states.facing))) {
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

    const explicitDir = Object.entries(this.states)
      .map(([dir, val]) => val ? dir : undefined)
      .filter((dir) => dir && dir !== 'power' && dir !== 'source' && dir !== '__typename');
    
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
   * @private
   */
  _changePower() {
    const oldPower = this.states.power;
    let newPower = 1;

    Maps.P6DArray.forEach(([_, [x, y, z]]) => {
      const block = this.engine.block(this.x + x, this.y + y, this.z + z);
      newPower = Math.max(newPower, block?.states.source ? block?.power ?? 1 : 1);
    });

    Maps.P4DArray.forEach(([dir, [x, _, z]]) => {
      const sideDown = this.engine.block(this.x + x, this.y - 1, this.z + z);
      const sideHori = this.engine.block(this.x + x, this.y, this.z + z);
      const sideUp = this.engine.block(this.x + x, this.y + 1, this.z + z);
      const above = this.engine.block(this.x, this.y + 1, this.z);

      if (sideHori?.transparent && sideDown?.type === BlockType.RedstoneDust) {
        newPower = Math.max(newPower, sideDown.power);
      }
      else if (sideHori?.type === BlockType.RedstoneRepeater && sideHori.states.powered && sideHori.states.facing === Maps.ReverseDir[dir]) {
        newPower = 16; // 之後會被減 1
      }

      if (above?.transparent && sideUp?.type === BlockType.RedstoneDust) {
        newPower = Math.max(newPower, sideUp.power);
      }
    });

    this.states.power = newPower - 1;
    if (oldPower !== newPower - 1) {
      this.sendPPUpdate();
    }
  }
}

export default RedstoneDust;