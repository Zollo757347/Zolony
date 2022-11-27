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
     * 此方塊是否提供頂部支撐點
     * @type {boolean}
     */
    this.upperSupport = options.fullSupport || false;

    /**
     * 此方塊是否需要底部支撐點
     * @type {boolean}
     */
    this.needBottomSupport = options.needBottomSupport || false;
    
    /**
     * 此方塊是否為可互動方塊
     * @type {boolean}
     */
    this.interactable = options.interactable || false;
  }

  /**
   * 取得此方塊的所有表面
   * @abstract
   */
  surfaces() {
    throw new Error('Not implemented yet.');
  }

  /**
   * 更新此方塊自身的狀態
   * @abstract
   */
  update() {
    throw new Error('Not implemented yet.');
  }
}

export default Block;