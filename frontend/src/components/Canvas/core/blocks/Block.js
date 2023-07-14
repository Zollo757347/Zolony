import { NewBlock, Maps } from "../utils";

/**
 * @typedef BlockStates 此方塊的狀態
 * @type {object}
 * @property {number} power 此方塊的充能等級
 * @property {boolean} source 此方塊是否為電源或被強充能
 */

/**
 * @typedef BlockData 方塊的數據
 * @type {object}
 * @property {import("../utils/BlockType")} type 方塊的種類
 * @property {boolean} breakable 方塊可否被破壞
 * @property {BlockStates} states 方塊的狀態
 */

/**
 * 代表一個方塊
 * @abstract
 */
class Block {
  constructor(options) {
    /**
     * 此方塊的 x 座標
     * @type {number}
     */
    this.x = options.x;
    
    /**
     * 此方塊的 y 座標
     * @type {number}
     */
    this.y = options.y;
    
    /**
     * 此方塊的 z 座標
     * @type {number}
     */
    this.z = options.z;

    /**
     * 遊戲引擎
     * @type {import("../../Engine").default}
     */
    this.engine = options.engine;

    /**
     * 此方塊的種類
     * @type {number}
     */
    this.type = options.type;

    /**
     * 此方塊的名稱
     * @type {string}
     */
    this.blockName = options.blockName;

    /**
     * 此方塊可否被破壞
     * @type {booolean}
     */
    this.breakable = options.breakable ?? true;

    /**
     * 方塊的狀態
     * @type {BlockStates}
     */
    this.states = { power: 0, source: false };

    /**
     * 此方塊是否為透明方塊
     * @type {boolean}
     */
    this.transparent = options.transparent ?? false;

    /**
     * 此方塊是否為完整方塊
     * @type {boolean}
     */
    this.fullBlock = options.fullBlock ?? false;

    /**
     * 此方塊是否提供頂部支撐點
     * @type {boolean}
     */
    this.upperSupport = options.fullSupport ?? options.upperSupport ?? false;

    /**
     * 此方塊是否提供底部支撐點
     * @type {boolean}
     */
    this.bottomSupport = options.fullSupport ?? options.bottomSupport ?? false;

    /**
     * 此方塊是否提供側面支撐點
     * @type {boolean}
     */
    this.sideSupport = options.fullSupport ?? options.sideSupport ?? false;

    /**
     * 此方塊是否需要支撐點
     * @type {boolean}
     */
    this.needSupport = options.needSupport ?? false;

    /**
     * 此方塊是否需要底部支撐點
     * @type {boolean}
     */
    this.needBottomSupport = options.needBottomSupport ?? false;
    
    /**
     * 此方塊是否為可互動方塊
     * @type {boolean}
     */
    this.interactable = options.interactable ?? false;

    /**
     * 此方塊是否會被紅石粉主動連接
     * @type {'full' | 'line' | 'none'}
     */
    this.redstoneAutoConnect = options.redstoneAutoConnect ?? 'none';
  }

  /**
   * 用給定的方塊資料生出方塊
   * @param {import("../Engine").Engine} engine 負責生成的遊戲引擎
   * @param {BlockData} data 
   * @returns {Block}
   */
  static spawn(engine, { x, y, z, type, states, breakable }) {
    const block = new (NewBlock(type))({ x, y, z, engine });
    block.breakable = breakable;
    block.states = states;
    return block;
  }

  /**
   * 把一個方塊轉換成可儲存的資料形式
   * @param {Block} block 
   * @returns {BlockData}
   */
  static extract(block) {
    const states = JSON.parse(JSON.stringify(block.states));
    delete states.__typename;
    return {
      type: block.type, 
      breakable: block.breakable, 
      states: states
    };
  }

  /**
   * 取得此方塊的充能強度
   * @type {number}
   */
  get power() {
    return this.states.power;
  }

  /**
   * 取得此方塊對指定方向導線元件外的方塊的能量輸出情形，只能被導線元件（紅石粉、紅石中繼器、紅石比較器）以外的方塊呼叫
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsBlock(direction) {
    return { strong: false, power: 0 };
  }

  /**
   * 取得此方塊對指定方向導線元件的能量輸出情形，只能被導線元件（紅石粉、紅石中繼器、紅石比較器）呼叫
   * @param {import("../utils/parseTexture").SixSides} direction
   * @returns {{ strong: boolean, power: number }}
   */
  powerTowardsWire(direction) {
    return { strong: this.states.source, power: this.states.power };
  }

  /**
   * 發送 Post Placement Update 到相鄰的方塊
   */
  sendPPUpdate() {
    this.engine.needRender = true;
    
    this.PPUpdate();
    Maps.P6DArray.forEach(([dir, [x, y, z]]) => {
      this.engine.block(this.x + x, this.y + y, this.z + z)?.PPUpdate(dir);
    });
  }

  /**
   * 根據 Post Placement Update 的來源方向更新自身狀態
   * @abstract
   */
  PPUpdate() {
    if (this.needBottomSupport) {
      if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
        this.engine._leftClick(this.x, this.y, this.z);
        return;
      }
    }

    if (this.needSupport) {
      const face = this.states.face ?? (this.states.facing === 'up' ? 'floor' : 'wall');
      let broken = false;
      switch (face) {
        case 'ceiling':
          if (!this.engine.block(this.x, this.y + 1, this.z)?.bottomSupport) {
            broken = true;
          }
          break;
  
        case 'floor':
          if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
            broken = true;
          }
          break;
  
        case 'wall':
          const dir = Maps.P4DMap.get(Maps.ReverseDir[this.states.facing]);
          if (!dir) {
            throw new Error(`${this.states.facing} is not a valid direction.`);
          }
  
          const [x, , z] = dir;
          if (!this.engine.block(this.x + x, this.y, this.z + z)?.sideSupport) {
            broken = true;
          }
          break;
  
        default: break;
      }

      if (broken) {
        this.engine._leftClick(this.x, this.y, this.z);
        return;
      }
    }
  }
}

export default Block;