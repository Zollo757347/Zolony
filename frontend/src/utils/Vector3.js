/**
 * 代表一個三維向量
 */
class Vector3 {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  /**
   * 與一個向量相加
   * @param {Vector3} vec 
   * @returns 相加後的新向量
   */
  add(vec) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  /**
   * 與一個向量相減
   * @param {Vector3} vec 
   * @returns 相減後的新向量
   */
  subtract(vec) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  /**
   * 與一個純量相乘
   * @param {number} scl 
   * @returns 相乘後的新向量
   */
  multiply(scl) {
    return new Vector3(this.x * scl, this.y * scl, this.z * scl);
  }

  /**
   * 與一個向量內積
   * @param {Vector3} vec 
   * @returns 內積後的純量
   */
  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  /**
   * 與一個向量外積
   * @param {Vector3} vec 
   * @returns 外積後的新向量
   */
  cross(vec) {
    return new Vector3(
      this.y * vec.z - this.z * vec.y, 
      this.z * vec.x - this.x * vec.z, 
      this.x * vec.y - this.y * vec.x
    );
  }

  /**
   * 以 x 軸為軸心，由 +y 軸向 +z 軸旋轉
   * @param {number} rad 旋轉弧度
   * @returns 旋轉後的新向量
   */
  rotateX(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
  
    return new Vector3(
      this.x, 
      c * this.y - s * this.z, 
      s * this.y + c * this.z
    );
  }

  /**
   * 以 y 軸為軸心，由 +z 軸向 +x 軸旋轉
   * @param {number} rad 旋轉弧度
   * @returns 旋轉後的新向量
   */
  rotateY(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    return new Vector3(
      s * this.z + c * this.x, 
      this.y, 
      c * this.z - s * this.x
    )
  }

  /**
   * 以 z 軸為軸心，由 +x 軸向 +y 軸旋轉
   * @param {number} rad 旋轉弧度
   * @returns 旋轉後的新向量
   */
  rotateZ(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    return new Vector3(
      c * this.x - s * this.y, 
      s * this.x + c * this.y, 
      this.z
    );
  }

  /**
   * 投影到觀察點為 (0, 0, cameraZ)，與觀察點距離 distance 的投影面上
   * @param {number} cameraZ 觀察點的 z 座標
   * @param {number} distance 觀察點與投影面的距離
   * @returns 旋轉後的新向量
   */
  projectZ(cameraZ, distance) {
    return new Vector3(
      this.x * distance / (cameraZ - this.z), 
      this.y * distance / (cameraZ - this.z), 
      this.z
    );
  }

  /**
   * 根據 xz 平面鏡像
   * @returns 旋轉後的向量
   */
  mirrorY() {
    return new Vector3(this.x, -this.y, this.z);
  }
}

export default Vector3;