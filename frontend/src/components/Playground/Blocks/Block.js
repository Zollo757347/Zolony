import Vector3 from "../../../utils/Vector3"; // eslint-disable-line no-unused-vars

/**
 * 代表一個方塊
 * @abstract
 */
class Block {
  constructor({ x, y, z, engine, type }) {
    this.x = x;
    this.y = y;
    this.z = z;

    /**
     * 遊戲引擎
     * @type {Engine}
     */
    this.engine = engine;

    this.type = type || 0;
  }

  /**
   * 取得此方塊的所有表面
   * @abstract
   */
  surfaces() {
    throw new Error('Not implemented yet.');
  }

  /**
   * 取得此方塊指定表面的材質
   * @param {Vector3} norm 指定表面的單位法向量
   * @abstract
   */
  surfaceTexture(norm) {
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