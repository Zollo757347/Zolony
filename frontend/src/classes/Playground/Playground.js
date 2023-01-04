import Axis from "../Axis";
import Vector3 from "../Vector3";
import { Concrete, GlassBlock, RedstoneDust, RedstoneRepeater, RedstoneTorch } from "./Blocks";
import { Lever } from "./Blocks/Lever";
import { RedstoneLamp } from "./Blocks/RedstoneLamp";
import { Engine } from "./Engine";

/**
 * @typedef PlaygroundAngles 記錄物體的旋轉角度
 * @type {object}
 * @property {number} theta 物體的水平轉角
 * @property {number} phi 物體的鉛直轉角
 */

/**
 * @typedef PlaygroundOptions
 * @type {object}
 * @property {number} canvasWidth 畫布的寬度，單位為像素
 * @property {number} canvasHeight 畫布的高度，單位為像素
 * @property {number} xLen 畫布中物體的 x 軸長度，單位為格
 * @property {number} yLen 畫布中物體的 y 軸長度，單位為格
 * @property {number} zLen 畫布中物體的 z 軸長度，單位為格
 * @property {PlaygroundAngles} 物體的初始角度
 */

/**
 * @typedef TargetBlock 目標方塊的資訊
 * @type {object}
 * @property {Vector3} cords 目標方塊在旋轉前的三維坐標
 * @property {Vector3[]} points 目標平面在旋轉、投影後的三維座標
 * @property {symbol} dir 目標平面在旋轉前的法向量
 */

/**
 * 3D 渲染的邏輯實作
 */
class Playground {
  constructor({ canvasWidth, canvasHeight, xLen, yLen, zLen, angles, canvas, preLoadData }) {
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
     * 物體的旋轉角度
     * @type {PlaygroundAngles}
     */
    this.angles = {
      theta: angles?.theta || 0, 
      phi: angles?.phi || 0
    };

    /**
     * 渲染的目標畫布
     */
    this.canvas = canvas;

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
     * 游標當前的 x 座標
     * @type {number}
     */
    this.cursorX = 0;

    /**
     * 游標當前的 y 座標
     * @type {number}
     */
    this.cursorY = 0;

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
     * @type {(new () => import("./Blocks/Block").Block)[]}
     */
    this.hotbar = [Concrete, GlassBlock, RedstoneLamp, RedstoneDust, RedstoneTorch, RedstoneRepeater, Lever];

    /**
     * 快捷欄上方塊的名稱
     * @type {string[]}
     */
    this.hotbarName = ['Concrete', 'Glass Block', 'Redstone Lamp', 'Redstone Dust', 'Redstone Torch', 'Redstone Repeater', 'Lever'];

    /**
     * 快捷欄當前方塊的駐標
     * @type {number}
     */
    this.hotbarTarget = 0;

    /**
     * 遊戲引擎
     * @type {Engine}
     */
    this.engine = preLoadData ? Engine.spawn(preLoadData) : new Engine({ xLen, yLen, zLen });

    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  /**
   * 設定畫布
   * @param {*} canvas 
   */
  setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * 設定游標當前的座標
   * @param {number} x 
   * @param {number} y 
   */
  setCursor(x, y) {
    this.cursorX = x;
    this.cursorY = y;
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
  adjustAngles(cursorX, cursorY, init = false) {
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
   * 根據滾輪滾動的幅度調整快捷欄
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
   */
  leftClick(canvasX, canvasY) {
    const target = this._getTarget(canvasX, canvasY);
    if (!target) return;

    const { cords: { x, y, z } } = target;
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return;

    this.engine.addTask('leftClick', [x, y, z]);
  }

  /**
   * 在游標指定的位置上按下使用鍵
   * @param {number} cursorX 游標在畫布上的 x 座標
   * @param {number} cursorY 游標在畫布上的 y 座標
   * @param {boolean} shiftDown 是否有按下 Shift 鍵
   */
  rightClick(canvasX, canvasY, shiftDown) {
    const target = this._getTarget(canvasX, canvasY);
    if (!target) return;

    let { cords: { x, y, z }, dir } = target;
    
    this.engine.addTask('rightClick', [x, y, z, shiftDown, dir, this.hotbar[this.hotbarTarget]]);
  }


  /**
   * 開始渲染畫面
   * @private
   */
  render() {
    if (this.canvas) {
      const context = this.canvas.getContext('2d', { alpha: false });
      context.fillStyle = 'white';
      context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  
      const target = this._getTarget(this.cursorX, this.cursorY);
      
      const surfaces = this._visibleSurfaces();
      const projectedSurfaces = this._projectSurfaces(surfaces);
  
      projectedSurfaces.sort(({ points: p1 }, { points: p2 }) => {
        return Math.min(...p1.map(({z}) => z)) - Math.min(...p2.map(({z}) => z));
      });
  
      projectedSurfaces.forEach(({ cords, points: [p1, p2, p3, p4], color }) => {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);
        context.lineTo(p4.x, p4.y);
        context.closePath();
        context.fill();
  
        if (target && target.cords.x === cords.x && target.cords.y === cords.y && target.cords.z === cords.z) {
          const p = target.points;
          context.beginPath();
          context.moveTo(p[0].x, p[0].y);
          context.lineTo(p[1].x, p[1].y);
          context.lineTo(p[2].x, p[2].y);
          context.lineTo(p[3].x, p[3].y);
          context.closePath();

          context.strokeStyle = this.engine.block(target.cords.x, target.cords.y, target.cords.z)?.breakable ? 'black' : 'red';
          context.stroke();
        }
      });
  
      context.fillStyle = 'black';
      context.font = '30px Arias';
      context.fillText(this.hotbarName[this.hotbarTarget], 20, 50);
    }

    requestAnimationFrame(this.render);
  }

  /**
   * 取得游標指向方塊的資訊
   * @param {number} cursorX 游標在畫布上的 x 座標
   * @param {number} cursorY 游標在畫布上的 y 座標
   * @returns {TargetBlock?}
   * @private
   */
  _getTarget(canvasX, canvasY) {
    const surfaces = this._visibleSurfaces(true);
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
      target = { cords, dir, points };
    });

    return target;
  }

  /**
   * 尋找所有指定的表面（互動箱或渲染箱）
   * @param {boolean} interactionBox true：互動箱，false：渲染箱
   * @returns {Surface[]}
   * @private
   */
  _visibleSurfaces(interactionBox = false) {
    const surfaces = [];

    for (let i = 0; i < this.xLen; i++) {
      for (let j = 0; j < this.yLen; j++) {
        for (let k = 0; k < this.zLen; k++) {
          if (this.engine.block(i, j, k).type === 0) continue;

          const blockSurfaces = interactionBox ? this.engine.block(i, j, k).interactionSurfaces() : this.engine.block(i, j, k).surfaces();
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

    surfaces.forEach(surface => {
      const newAxes = Axis.VectorMap(v => v
        .rotateX(surface.xAngle || 0)
        .rotateZ(surface.zAngle || 0)
        .rotateY(this.angles.theta)
        .rotateX(this.angles.phi)
      );

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

export { Playground };