import { AirBlock, Axis, Concrete, GlassBlock, Lever, NewBlock, RedstoneDust, RedstoneLamp, RedstoneRepeater, RedstoneTorch, Vector3 } from "./core";
import Engine from "./Engine";
import Renderer from "./Renderer";

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
 * 3D 渲染的邏輯實作
 */
class Playground {
  constructor({ canvasWidth, canvasHeight, xLen, yLen, zLen, angles, canvas, preLoadData }) {
    /**
     * 畫布中物體的 x 軸長度，單位為格
     * @type {number}
     */
    this.xLen = preLoadData?.xLen ?? xLen;
    
    /**
     * 畫布中物體的 y 軸長度，單位為格
     * @type {number}
     */
    this.yLen = preLoadData?.yLen ?? yLen;
    
    /**
     * 畫布中物體的 z 軸長度，單位為格
     * @type {number}
     */
    this.zLen = preLoadData?.zLen ?? zLen;

    /**
     * 畫布的中心點位置
     * @type {Vector3}
     */
    this.center = new Vector3(this.xLen / 2, this.yLen / 2, this.zLen / 2);

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
     * 快捷欄上的方塊
     * @type {(new () => import("./Playground/Blocks/Block").Block)[]}
     */
    this.hotbar = preLoadData?.availableBlocks?.length ? preLoadData?.availableBlocks?.map(t => NewBlock(t)) : [Concrete, GlassBlock, RedstoneLamp, RedstoneDust, RedstoneTorch, RedstoneRepeater, Lever];

    /**
     * 快捷欄上方塊的名稱
     * @type {string[]}
     */
    this.hotbarName = this.hotbar.map(B => new B().blockName);

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

    /**
     * 遊戲渲染器
     * @type {Renderer}
     */
    this.renderer = new Renderer(this);

    /**
     * 此畫布是否被更新過，需要重新渲染
     */
    this._updated = true;

    /**
     * 此畫布是否仍在運作中
     * @type {boolean}
     * @private
     */
    this._alive = true;
  }

  /**
   * 設定畫布
   * @param {*} canvas 
   */
  initialize(canvas) {
    this.canvas = canvas;
    this.engine.startTicking();
    this.renderer.initialize(canvas);
  }

  /**
   * 設定游標當前的座標
   * @param {number} x 
   * @param {number} y 
   */
  setCursor(x, y) {
    this.cursorX = x;
    this.cursorY = y;
    this._updated = true;
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
        theta: this.angles.theta + (this._prevRefX - cursorX) * 0.0087, 
        phi: Math.max(Math.min(this.angles.phi + (this._prevRefY - cursorY) * 0.0087, Math.PI / 2), -(Math.PI / 2))
      };
    }

    this._prevRefX = cursorX;
    this._prevRefY = cursorY;
    this._updated = true;
  }

  /**
   * 根據滾輪滾動的幅度調整快捷欄
   * @param {number} deltaY 滾輪滾動的幅度
   */
  scrollHotbar(deltaY) {
    this._prevRefWheel += deltaY;
    if (!this.hotbar.length) return;

    this.hotbarTarget = (Math.trunc(this._prevRefWheel / 100) % this.hotbar.length + this.hotbar.length) % this.hotbar.length;
    this._updated = true;
  }

  /**
   * 在游標指定的位置上按下破壞鍵
   * @param {number} cursorX 游標在畫布上的 x 座標
   * @param {number} cursorY 游標在畫布上的 y 座標
   */
  leftClick(canvasX, canvasY) {
    this.renderer.getTarget(canvasX, canvasY);
    const target = null;
    if (!target) return;

    const { cords: { x, y, z } } = target;
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return;

    this.engine.addTask('leftClick', [x, y, z]);
    this._updated = true;
  }

  /**
   * 在游標指定的位置上按下使用鍵
   * @param {number} cursorX 游標在畫布上的 x 座標
   * @param {number} cursorY 游標在畫布上的 y 座標
   * @param {boolean} shiftDown 是否有按下 Shift 鍵
   */
  async rightClick(canvasX, canvasY, shiftDown) {
    const target = await this.renderer.getTarget(canvasX, canvasY);
    if (!target) return;

    const [x, y, z, ...normDir] = target;
    
    this.engine.addTask('rightClick', [x, y, z, shiftDown, normDir, Axis.PX, this.hotbar[this.hotbarTarget] ?? AirBlock]);
    this._updated = true;
  }

  /**
   * 不使用此畫布時必須呼叫此函式
   */
  destroy() {
    this._alive = false;
    this.engine.destroy();
  }

  /**
   * 此畫布是否需要重新渲染
   */
  get _needRender() {
    return this._updated || this.engine.needRender;
  }
}

export default Playground;