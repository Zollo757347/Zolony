import Vector3 from "../../../utils/Vector3"; // eslint-disable-line no-unused-vars

/**
 * 代表一個方塊
 * @abstract
 */
class Block {
  constructor({ x, y, z, type }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type || 0;
  }

  /**
   * 決定兩個相鄰方塊的相鄰面該如何渲染
   * @param {Block} b1 方塊一
   * @param {Block} b2 方塊二
   * @returns {[boolean, boolean]} 第一項為真時代表需要渲染方塊一，第二項為真時代表需要渲染方塊二
   */
  static toRender(b1, b2) {
    if (b1.type === b2.type) return [false, false];
    if (b1.type === 0) return [false, true];
    if (b2.type === 0) return [true, false];
    if (b1.type === 1) return [true, false];
    return [false, true];
  }

  /**
   * 取得此方塊指定表面的資料
   * @param {Vector3} norm 指定表面的單位法向量
   * @abstract
   */
  surface(norm) {
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
}

export default Block;