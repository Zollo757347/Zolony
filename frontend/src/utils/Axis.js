import Vector3 from "./Vector3";

/**
 * 與座標軸相關的功能
 */
class Axis extends null {
  /**
   * 表示 +x 座標軸
   * @type {symbol}
   */
  static PX = Symbol();

  /**
   * 表示 +y 座標軸
   * @type {symbol}
   */
  static PY = Symbol();
  
  /**
   * 表示 +z 座標軸
   * @type {symbol}
   */
  static PZ = Symbol();

  /**
   * 表示 -x 座標軸
   * @type {symbol}
   */
  static NX = Symbol();

  /**
   * 表示 -y 座標軸
   * @type {symbol}
   */
  static NY = Symbol();

  /**
   * 表示 -z 座標軸
   * @type {symbol}
   */
  static NZ = Symbol();

  /**
   * 每個座標軸所對應的單位軸向量
   * @type {{ [key: symbol]: Vector3 }}
   */
  static VECTOR = {
    [Axis.PX]: new Vector3(1, 0, 0), 
    [Axis.PY]: new Vector3(0, 1, 0), 
    [Axis.PZ]: new Vector3(0, 0, 1), 
    [Axis.NX]: new Vector3(-1, 0, 0), 
    [Axis.NY]: new Vector3(0, -1, 0), 
    [Axis.NZ]: new Vector3(0, 0, -1)
  };

  /**
   * 對每個單位軸向量呼叫 cb 後，回傳一個新的物件，運作方式與 Array.map() 相似
   * @param {(Vector3) => T} cb 要執行的函式
   * @returns {{ [key: symbol]: T }}
   * @template T
   */
  static VectorMap(cb) {
    return {
      [Axis.PX]: cb(new Vector3(1, 0, 0)), 
      [Axis.PY]: cb(new Vector3(0, 1, 0)), 
      [Axis.PZ]: cb(new Vector3(0, 0, 1)), 
      [Axis.NX]: cb(new Vector3(-1, 0, 0)), 
      [Axis.NY]: cb(new Vector3(0, -1, 0)), 
      [Axis.NZ]: cb(new Vector3(0, 0, -1))
    };
  }

  /**
   * 判斷一個 symbol 是不是正的軸向量
   * @param {symbol} axis 
   * @returns {boolean}
   */
  static IsPositive(axis) {
    return axis === this.PX || axis === this.PY || axis === this.PZ;
  }

  /**
   * 判斷一個 symbol 是不是負的軸向量
   * @param {symbol} axis 
   * @returns {boolean}
   */
  static IsNegative(axis) {
    return axis === this.NX || axis === this.NY || axis === this.NZ;
  }
}

export default Axis;