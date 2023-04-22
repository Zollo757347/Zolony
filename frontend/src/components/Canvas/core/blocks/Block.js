import { NewBlock, Maps } from "../utils";

/**
 * @typedef Surface 代表一個有限大小的有向表面
 * @type {object}
 * @property {Vector3} cords 表面的所屬方塊在旋轉前的三維坐標
 * @property {symbol} dir 表面在旋轉前的法向量
 * @property {Vector3[]} points 表面的所有二維頂點座標
 * @property {string} color 表面的顏色
 * @property {number?} xAngle 在渲染前需要先沿著 x 軸旋轉的角度
 * @property {number?} zAngle 在渲染前需要先沿著 z 軸旋轉的角度
 */

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
     * @type {import("../Engine").Engine}
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
    throw new Error('Not implemented yet.');
  }
}

export default Block;