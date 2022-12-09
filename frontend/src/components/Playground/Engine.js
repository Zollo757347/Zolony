import Axis from "../../utils/Axis";
import AirBlock from "./Blocks/AirBlock";
import Block from "./Blocks/Block"; // eslint-disable-line no-unused-vars
import Concrete from "./Blocks/Concrete";

let _redstoneInterval = null;

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
     * @type {Block[][][]}
     * @private
     */
    this._pg = Array.from({ length: xLen }, (_, x) => 
      Array.from({ length: yLen }, (_, y) => 
        Array.from({ length: zLen }, (_, z) => y === 0 ? new Concrete({ x, y, z, engine: this }) : new AirBlock({ x, y, z, engine: this }))
      )
    );
  }

  startTicking() {
    if (_redstoneInterval) {
      clearInterval(_redstoneInterval);
    }

    _redstoneInterval = setInterval(() => {
      while (this.taskQueue.length) {
        const [taskName, params] = this.taskQueue.shift();

        switch (taskName) {
          case 'leftClick':
            this.leftClick(...params);
            break;

          case 'rightClick':
            this.rightClick(...params);
            break;

          default: break;
        }
      }
    }, 50);
  }

  addTask(name, params) {
    this.taskQueue.push([name, params]);
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
    if (newBlock.needBottomSupport && !this.block(x, y - 1, z)?.upperSupport) return;

    this._pg[x][y][z] = newBlock;
    this._pg[x][y][z].sendPPUpdate();
  }
}

export { Engine };