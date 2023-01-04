import Axis from "../Axis";
import Utils from "../Utils";
import { AirBlock, Block, Concrete } from "./Blocks";
import { BlockType } from "./BlockType";


/**
 * @typedef {{ leftClick: [number, number, number], rightClick: [number, number, number, boolean, symbol, new () => Block], torchUpdate: [number, number, number, boolean], repeaterUpdate: [number, number, number, boolean], lampUnlit: [number, number, number] }} TaskParams
 */

/**
 * @typedef {{ [K in keyof TaskParams]: [K, TaskParams[K], number] }[keyof TaskParams]} Task 一項待辦工作
 */

/**
 * @typedef MapData 地圖的數據
 * @type {object}
 * @property {number} xLen x 軸的長度
 * @property {number} yLen y 軸的長度
 * @property {number} zLen z 軸的長度
 * @property {string} mapName 地圖的名稱
 * @property {import("./Blocks/Block").BlockData[][][]} playground 地圖上所有方塊的狀態
 */

class Engine {
  constructor({ xLen, yLen, zLen, mapName }) {
    /**
     * x 軸的長度
     * @type {number}
     */
    this.xLen = xLen;

    /**
     * y 軸的長度
     * @type {number}
     */
    this.yLen = yLen;

    /**
     * z 軸的長度
     * @type {number}
     */
    this.zLen = zLen;

    /**
     * 地圖的名稱
     * @type {string}
     */
    this.mapName = mapName;

    /**
     * 工作佇列
     * @type {Task[]}
     */
    this.taskQueue = [];

    /**
     * 所有方塊
     * @type {import("./Blocks/Block").Block[][][]}
     * @private
     */
    this._pg = Array.from({ length: xLen }, (_, x) => 
      Array.from({ length: yLen }, (_, y) => 
        Array.from({ length: zLen }, (_, z) => y === 0 ? new Concrete({ x, y, z, engine: this, breakable: false }) : new AirBlock({ x, y, z, engine: this }))
      )
    );

    this._startTicking();
  }

  /**
   * 用給定的地圖資料生出引擎
   * @param {MapData} data
   * @returns {Engine} 
   */
  static spawn({ xLen, yLen, zLen, mapName, playground }) {
    const engine = new Engine({ xLen, yLen, zLen, mapName });
    playground.forEach((layer, i) => {
      layer.forEach((line, j) => {
        line.forEach((block, k) => {
          engine._pg[i][j][k] = Block.spawn(engine, { ...block, x: i, y: j, z: k });
        })
      })
    });
    return engine;
  }

  /**
   * 把一個引擎轉換成可儲存的資料形式
   * @param {Engine} engine 
   * @returns {MapData}
   */
  static extract(engine) {
    return {
      xLen: engine.xLen, 
      yLen: engine.yLen, 
      zLen: engine.zLen, 
      mapName: engine.mapName, 
      playground: engine._pg.map(layer => {
        return layer.map(line => {
          return line.map(block => Block.extract(block));
        })
      })
    };
  }

  /**
   * 新增一項工作到工作佇列中
   * @template {keyof TaskParams} K
   * @param {K} name 工作名稱
   * @param {TaskParams[K]} params 所需參數
   * @param {number} tickAfter 幾刻後執行
   * @returns 
   */
  addTask(name, params, tickAfter = 0) {
    // 忽略重複的工作
    if (this.taskQueue.some(t => t[0] === name && t[2] === tickAfter && Utils.StrictEqual(t[1], params))) return;

    this.taskQueue.push([name, params, tickAfter]);
  }

  /**
   * 取得指定座標上的方塊
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {import("./Blocks/Block").Block | null}
   */
  block(x, y, z) {
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return null;
    return this._pg[x][y][z];
  }


  /**
   * 區間計時器
   * @type {number | null}
   * @private
   */
  _interval = null;

  /**
   * 開始模擬遊戲
   * @private
   */
  _startTicking() {
    if (this._interval) {
      clearInterval(this._interval);
    }

    this._interval = setInterval(() => {
      const nextQueue = [];

      while (this.taskQueue.length) {
        const task = this.taskQueue.shift();
        if (!task) break;

        const [taskName, params, tickAfter] = task;

        if (tickAfter) {
          nextQueue.push([taskName, params, tickAfter - 1]);
          continue;
        }

        switch (taskName) {
          case 'leftClick':
            this._leftClick(...params);
            break;

          case 'rightClick':
            this._rightClick(...params);
            break;

          case 'torchUpdate':
            this._torchUpdate(...params);
            break;

          case 'repeaterUpdate':
            this._repeaterUpdate(...params);
            break;

          case 'lampUnlit':
            this._lampUnlit(...params);
            break;

          default: break;
        }
      }

      this.taskQueue.push(...nextQueue);
    }, 100);
  }

  /**
   * 破壞指定座標上的方塊
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {Block | null} 被破壞的方塊
   * @private
   */
  _leftClick(x, y, z) {
    const block = this._pg[x][y][z];
    if (!block.breakable) return null;

    this._pg[x][y][z] = new AirBlock({ x, y, z, engine: this });
    block.sendPPUpdate(this._pg[x][y][z]);
    return block;
  }

  /**
   * 對指定方塊的指定面上按下使用鍵
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {boolean} shiftDown 
   * @param {symbol} dir 指定面的法向量方向
   * @param {new () => Block} B 在不觸發互動時所放下的方塊
   * @private
   */
  _rightClick(x, y, z, shiftDown, dir, B) {
    // 如果指向的方塊可以互動，就互動
    if (!shiftDown && this._pg[x][y][z].interactable) {
      this._pg[x][y][z].interact();
      return;
    }

    // 其他情形則直接把方塊放在指定位置上
    let norm = Axis.VECTOR[dir];
    x += norm.x;
    y += norm.y;
    z += norm.z;

    // 不能超出範圍
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return;

    // 原位置必須為空
    if (this._pg[x][y][z].type !== 0) return;

    const newBlock = new B({ x, y, z, engine: this });
    newBlock.setFacing?.(dir);
    if (newBlock.needBottomSupport && !this.block(x, y - 1, z)?.upperSupport) return;

    this._pg[x][y][z] = newBlock;
    this._pg[x][y][z].sendPPUpdate();
  }

  /**
   * 更新指定位置上的紅石火把的明暗
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {boolean} lit 新的明暗狀態
   * @private
   */
  _torchUpdate(x, y, z, lit) {
    const block = this.block(x, y, z);
    if (block?.type !== BlockType.RedstoneTorch) return;

    block.torchUpdate(lit);
  }

  /**
   * 更新指定位置上的紅石中繼器的觸發狀態
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {boolean} powered 新的觸發狀態
   * @private
   */
  _repeaterUpdate(x, y, z, powered) {
    const block = this.block(x, y, z);
    if (block?.type !== BlockType.RedstoneRepeater) return;

    block.repeaterUpdate(powered);
  }

  /**
   * 關閉指定位置的紅石燈
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @private
   */
  _lampUnlit(x, y, z) {
    const block = this.block(x, y, z);
    if (block?.type !== BlockType.RedstoneLamp) return;

    block.lampUnlit();
  }
}

export { Engine };