import Axis from "../../utils/Axis";
import Vector3 from "../../utils/Vector3";
import Concrete from "./Blocks/Concrete";
import RedstoneDust from "./Blocks/RedstoneDust";
import GlassBlock from "./Blocks/GlassBlock";
import { Engine } from "./Engine";

/**
 * @typedef PlaygroundAngles 記錄觀察點的角度
 * @type {object}
 * @property {number} theta 觀察點的水平轉角
 * @property {number} phi 觀察點的鉛直轉角
 */

/**
 * @typedef PlaygroundOptions
 * @type {object}
 * @property {number} canvasWidth 畫布的寬度，單位為像素
 * @property {number} canvasHeight 畫布的高度，單位為像素
 * @property {number} xLen 畫布中物體的 x 軸長度，單位為格
 * @property {number} yLen 畫布中物體的 y 軸長度，單位為格
 * @property {number} zLen 畫布中物體的 z 軸長度，單位為格
 * @property {PlaygroundAngles} 觀察點的初始角度
 */

/**
 * @typedef TargetBlock 目標方塊的資訊
 * @type {object}
 * @property {Vector3} cords 目標方塊在旋轉前的三維坐標
 * @property {symbol} dir 目標平面在旋轉前的法向量
 */

/**
 * @typedef Surface 代表一個有限大小的有向表面
 * @type {object}
 * @property {Vector3} cords 表面的所屬方塊在旋轉前的三維坐標
 * @property {symbol} dir 表面在旋轉前的法向量
 * @property {Vector3[]} points 表面的所有頂點座標
 * @property {string} color 表面的材質
 */

/**
 * 3D 渲染的邏輯實作
 */
class Playground {
  constructor({ canvasWidth, canvasHeight, xLen, yLen, zLen, angles }) {
    /**
     * 畫布中物體的 x 軸長度，單位為格
     * @type {number}
     */
    this.xLen = xLen;
    
    /**
     * 畫布中物體的 y 軸長度，單位為格
     * @type {number}
     */
    this.yLen = yLen;
    
    /**
     * 畫布中物體的 z 軸長度，單位為格
     * @type {number}
     */
    this.zLen = zLen;

    /**
     * 畫布的中心點位置
     * @type {Vector3}
     */
    this.center = new Vector3(xLen / 2, yLen / 2, zLen / 2);

    /**
     * 觀察點的角度
     * @type {PlaygroundAngles}
     */
    this.angles = {
      theta: angles?.theta || 0, 
      phi: angles?.phi || 0
    };

    /**
     * 畫布的寬度，單位為像素
     * @type {number}
     */
    this.canvasWidth = canvasWidth;

    /**
     * 畫布的高度，單位為像素
     * @type {number}
     */
    this.canvasHeight = canvasHeight;

    /**
     * 物體的縮放倍率
     * @type {number}
     */
    this.stretchMult = Math.min(canvasWidth, canvasHeight) / Math.max(xLen, yLen, zLen);

    /**
     * 投影面的 z 座標
     * @type {number}
     */
    this.screenZ = Math.min(canvasWidth, canvasHeight);

    /**
     * 觀察點的 z 座標
     * @type {number}
     */
    this.cameraZ = Math.min(canvasWidth, canvasHeight) * 2;

    /**
     * 投影面與觀察點的距離
     * @type {number}
     */
    this.distance = this.cameraZ - this.screenZ;

    /**
     * 快捷欄上的方塊
     * @type {new () => Block}
     */
    this.hotbar = [Concrete, GlassBlock, RedstoneDust];

    /**
     * 快捷欄當前方塊的駐標
     * @type {number}
     */
    this.hotbarTarget = 0;

    /**
     * 遊戲引擎
     * @type {Engine}
     */
    this.engine = new Engine({ xLen, yLen, zLen });
  }

  _prevRefX = 0;
  _prevRefY = 0;
  _prevRefWheel = 0;

  /**
   * 根據當前游標與先前座標的差距來調整觀察者角度
   * @param {number} cursorX 游標在網頁上的 x 座標
   * @param {number} cursorY 游標在網頁上的 y 座標
   * @param {boolean} init 是否僅初始化
   */
  adjustAngles(cursorX, cursorY, init) {
    if (!init) {
      this.angles = {
        theta: this.angles.theta + (cursorX - this._prevRefX) * 0.0087, 
        phi: Math.max(Math.min(this.angles.phi + (cursorY - this._prevRefY) * 0.0087, Math.PI / 2), -(Math.PI / 2))
      };
    }

    this._prevRefX = cursorX;
    this._prevRefY = cursorY;
  }

  /**
   * 根據滾輪滾動的數值調整快捷欄
   * @param {number} deltaY 滾輪滾動的幅度
   */
  scrollHotbar(deltaY) {
    this._prevRefWheel += deltaY;
    this.hotbarTarget = (Math.trunc(this._prevRefWheel / 100) % this.hotbar.length + this.hotbar.length) % this.hotbar.length;
  }

  /**
   * 在游標指定的位置上按下破壞鍵
   * @param {number} cursorX 游標在畫布上的 x 座標
   * @param {number} cursorY 游標在畫布上的 y 座標
   * @returns {Block} 被破壞的方塊
   */
  leftClick(canvasX, canvasY) {
    const target = this._getTarget(canvasX, canvasY);
    if (!target) return;

    const { cords: { x, y, z } } = target;
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return;

    return this.engine.leftClick(x, y, z);
  }

  /**
   * 在游標指定的位置上按下使用鍵
   * @param {number} cursorX 游標在畫布上的 x 座標
   * @param {number} cursorY 游標在畫布上的 y 座標
   */
  rightClick(canvasX, canvasY) {
    const target = this._getTarget(canvasX, canvasY);
    if (!target) return;

    let { cords: { x, y, z }, dir } = target;
    this.engine.rightClick(x, y, z, dir, this.hotbar[this.hotbarTarget]);
  }

  /**
   * 在指定畫布上渲染物體，畫布的大小需與初始值相同
   * @param {JSX.IntrinsicElements.canvas} canvas 
   */
  renderOn(canvas) {
    if (canvas.width !== this.canvasWidth || canvas.height !== this.canvasHeight) {
      throw new Error('The dimension of the canvas does not correspond to the initial value.');
    }

    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const surfaces = this._visibleSurfaces();
    const projectedSurfaces = this._projectSurfaces(surfaces);

    projectedSurfaces.sort(({ points: p1 }, { points: p2 }) => 
      Math.min(...p1.map(p => p.z)) - Math.min(...p2.map(p => p.z))
    );

    projectedSurfaces.forEach(({ points: [p1, p2, p3, p4], color }) => {
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineTo(p3.x, p3.y);
      context.lineTo(p4.x, p4.y);
      context.closePath();
      context.fill();
    });
  }

  /**
   * 取得游標指向方塊的資訊
   * @param {number} cursorX 游標在畫布上的 x 座標
   * @param {number} cursorY 游標在畫布上的 y 座標
   * @returns {TargetBlock}
   * @private
   */
  _getTarget(canvasX, canvasY) {
    const surfaces = this._visibleSurfaces();
    const projectedSurfaces = this._projectSurfaces(surfaces);

    let maxZ = -Infinity;
    let target = null;

    projectedSurfaces.forEach(({ cords, points, dir }) => {
      const min = Math.min(...points.map(p => p.z));
      if (maxZ >= min) return;

      let sign = 0, v1, v2, cross;
      for (let i = 0; i < 4; i++) {
        const { x: x1, y: y1 } = points[i];
        const { x: x2, y: y2 } = points[(i + 1) & 3];

        v1 = { x: x2 - x1, y: y2 - y1 };
        v2 = { x: canvasX - x1, y: canvasY - y1 };
        cross = v1.x * v2.y - v2.x * v1.y;
        if (cross * sign < 0) return;
        sign = cross > 0 ? 1 : (cross === 0 ? 0 : -1);
      }

      maxZ = min;
      target = { cords, dir };
    });

    return target;
  }

  /**
   * 尋找所有需要渲染的表面
   * @returns {Surface[]}
   * @private
   */
  _visibleSurfaces() {
    const surfaces = [];

    for (let i = 0; i < this.xLen; i++) {
      for (let j = 0; j < this.yLen; j++) {
        for (let k = 0; k < this.zLen; k++) {
          if (this.engine.block(i, j, k).type === 0) continue;

          const blockSurfaces = this.engine.block(i, j, k).surfaces();
          surfaces.push(...blockSurfaces);
        }
      }
    }

    return surfaces;
  }

  /**
   * 將所有平面投影在螢幕上，傳入參數的部分值會被改動，為了加速渲染會移除部分看不見的平面
   * @param {Surface[]} surfaces 投影前的平面
   * @returns {Surface[]} 投影後且有可能會被看見的平面
   * @private
   */
  _projectSurfaces(surfaces) {
    const offset = new Vector3(this.canvasWidth / 2, this.canvasHeight / 2, 0);
    const camera = new Vector3(0, 0, this.cameraZ);

    const newAxes = Axis.VectorMap(v => v.rotateY(this.angles.theta).rotateX(this.angles.phi));

    surfaces.forEach(surface => {
      let checked = false;
      for (let i = 0; i < surface.points.length; i++) {
        const newPoint = surface.points[i]
          .subtract(this.center)
          .multiply(this.stretchMult)
          .rotateY(this.angles.theta)
          .rotateX(this.angles.phi);

        if (!checked && newPoint.subtract(camera).dot(newAxes[surface.dir]) > 0) {
          surface.points = [];
          return;
        }
        checked = true;

        surface.points[i] = newPoint
          .projectZ(this.cameraZ, this.distance)
          .mirrorY()
          .add(offset);
      }
    });

    return surfaces.filter(s => s.points.length);
  }
}

export default Playground;