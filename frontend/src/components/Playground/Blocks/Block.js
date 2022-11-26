import Vector3 from "../../../utils/Vector3"; // eslint-disable-line no-unused-vars

/**
 * 代表一個方塊
 * @abstract
 */
class Block {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.z = options.z;

    /**
     * 遊戲引擎
     * @type {Engine}
     */
    this.engine = options.engine;

    this.type = options.type;

    this.upperSupport = options.fullSupport || false;
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
   * 根據周圍方塊的狀態更新自身的狀態
   * @abstract
   */
  update() {
    throw new Error('Not implemented yet.');
  }
}

export default Block;