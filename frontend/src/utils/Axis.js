import Vector3 from "./Vector3";

/**
 * 所有沿座標軸的單位向量
 */
class Axis extends null {
  static PX = 0b100;
  static PY = 0b010;
  static PZ = 0b001;
  static NX = ~0b100;
  static NY = ~0b010;
  static NZ = ~0b001;

  static VECTOR = {
    [Axis.PX]: new Vector3(1, 0, 0), 
    [Axis.PY]: new Vector3(0, 1, 0), 
    [Axis.PZ]: new Vector3(0, 0, 1), 
    [Axis.NX]: new Vector3(-1, 0, 0), 
    [Axis.NY]: new Vector3(0, -1, 0), 
    [Axis.NZ]: new Vector3(0, 0, -1)
  };

  /**
   * 判斷向量是否指向任一個正座標軸
   * @param {Vector3} axis 
   * @returns 
   */
  static IsPositive(axis) {
    return axis === this.PX || axis === this.PY || axis === this.PZ;
  }

  /**
   * 判斷向量是否指向任一個負座標軸
   * @param {Vector3} axis 
   * @returns 
   */
  static IsNegative(axis) {
    return axis === this.NX || axis === this.NY || axis === this.NZ;
  }
}

export default Axis;