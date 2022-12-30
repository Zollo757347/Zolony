import Axis from "../Axis";
import Utils from "../Utils";
import { AirBlock, Concrete } from "./Blocks";

class Engine {
  constructor({ xLen, yLen, zLen }) {
    /**
     * x 軸的長度
     * @type number
     */
    this.xLen = xLen;

    /**
     * y 軸的長度
     * @type number
     */
    this.yLen = yLen;

    /**
     * z 軸的長度
     * @type number
     */
    this.zLen = zLen;

    this.taskQueue = [];

    /**
     * 所有方塊
     * @type {import("./").Block[][][]}
     * @private
     */
    this._pg = Array.from({ length: xLen }, (_, x) => 
      Array.from({ length: yLen }, (_, y) => 
        Array.from({ length: zLen }, (_, z) => y === 0 ? new Concrete({ x, y, z, engine: this }) : new AirBlock({ x, y, z, engine: this }))
      )
    );
  }

  _redstoneInterval = null;
  startTicking() {
    if (this._redstoneInterval) {
      clearInterval(this._redstoneInterval);
    }

    this._redstoneInterval = setInterval(() => {
      const nextQueue = [];

      while (this.taskQueue.length) {
        const [taskName, params, tickAfter] = this.taskQueue.shift();

        if (tickAfter) {
          nextQueue.push([taskName, params, tickAfter - 1]);
          continue;
        }

        switch (taskName) {
          case 'leftClick':
            this.leftClick(...params);
            break;

          case 'rightClick':
            this.rightClick(...params);
            break;

          case 'torchUpdate':
            this.torchUpdate(...params);
            break;

          case 'repeaterUpdate':
            this.repeaterUpdate(...params);
            break;

          default: break;
        }
      }

      this.taskQueue.push(...nextQueue);
    }, 100);
  }

  addTask(name, params, tickAfter = 0) {
    if (this.taskQueue.some(t => t[0] === name && t[2] === tickAfter && Utils.StrictEqual(t[1], params))) return;
    this.taskQueue.push([name, params, tickAfter]);
  }

  /**
   * 取得指定座標上的方塊
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {Block}
   */
  block(x, y, z) {
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return undefined;
    return this._pg[x][y][z];
  }

  /**
   * 在指定方塊上按下破壞鍵
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {Block} 被破壞的方塊
   */
  leftClick(x, y, z) {
    const block = this._pg[x][y][z];
    this._pg[x][y][z] = new AirBlock({ x, y, z, engine: this });
    block.sendPPUpdate(this._pg[x][y][z]);
    return block;
  }

  /**
   * 在指定方塊的指定面上按下使用鍵
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {symbol} dir 指定面的法向量方向
   * @param {new () => Block} B 在不觸發互動時所放下的方塊
   * @returns 
   */
  rightClick(x, y, z, dir, B) {
    if (this._pg[x][y][z].interactable) {
      this._pg[x][y][z].interact();
      return;
    }

    let norm = Axis.VECTOR[dir];
    x += norm.x;
    y += norm.y;
    z += norm.z;
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return;
    if (this._pg[x][y][z].type !== 0) return;

    const newBlock = new B({ x, y, z, engine: this });
    newBlock.setFacing?.(dir);
    if (newBlock.needBottomSupport && !this.block(x, y - 1, z)?.upperSupport) return;

    this._pg[x][y][z] = newBlock;
    this._pg[x][y][z].sendPPUpdate();
  }

  torchUpdate(x, y, z, lit) {
    const block = this.block(x, y, z);
    if (block?.type !== 101) return;

    block.torchUpdate(lit);
  }

  repeaterUpdate(x, y, z, powered) {
    const block = this.block(x, y, z);
    if (block?.type !== 102) return;

    block.repeaterUpdate(powered);
  }
}

export { Engine };