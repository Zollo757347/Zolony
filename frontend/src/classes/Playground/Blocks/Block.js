import Axis from "../../Axis";

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
 * @typedef BlockState 此方塊的狀態
 * @type {object}
 * @property {number} power 此方塊的充能等級
 * @property {boolean} source 此方塊是否為電源或被強充能
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
     * 方塊的狀態
     * @type {BlockState}
     */
    this.states = { power: 0, source: false };

    /**
     * 此方塊是否為透明方塊
     * @type {boolean}
     */
    this.transparent = options.transparent || false;

    /**
     * 此方塊是否提供頂部支撐點
     * @type {boolean}
     */
    this.upperSupport = options.fullSupport || options.upperSupport || false;

    /**
     * 此方塊是否提供側面支撐點
     * @type {boolean}
     */
    this.sideSupport = options.fullSupport || options.sideSupport || false;

    /**
     * 此方塊是否需要支撐點
     * @type {boolean}
     */
    this.needSupport = options.needSupport || false;

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

    /**
     * 此方塊是否會被紅石粉主動連接
     * @type {'full' | 'line' | 'none'}
     */
    this.redstoneAutoConnect = options.redstoneAutoConnect || 'none';
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
    this.PPUpdate();
    [Axis.NX, Axis.PX, Axis.NZ, Axis.PZ, Axis.NY, Axis.PY].forEach(dir => {
      const norm = Axis.VECTOR[dir];
      this.engine.block(this.x + norm.x, this.y + norm.y, this.z + norm.z)?.PPUpdate(Axis.ReverseTable[dir]);
    });
  }

  /**
   * 取得此方塊的渲染箱的所有表面
   * @returns {Surface[]}
   * @abstract
   */
  surfaces() {
    throw new Error('Not implemented yet.');
  }

  /**
   * 取得此方塊的互動箱的所有表面
   */
  interactionSurfaces() {
    return this.surfaces();
  }

  /**
   * 根據 Post Placement Update 的來源方向更新自身狀態
   * @abstract
   */
  PPUpdate() {
    throw new Error('Not implemented yet.');
  }
}

export { Block };