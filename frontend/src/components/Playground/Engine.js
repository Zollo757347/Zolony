import AirBlock from "./Blocks/AirBlock";
import Block from "./Blocks/Block"; // eslint-disable-line no-unused-vars
import OpaqueBlock from "./Blocks/OpaqueBlock";

class Engine {
  constructor({ xLen, yLen, zLen }) {
    this.xLen = xLen;
    this.yLen = yLen;
    this.zLen = zLen;

    /**
     * 所有方塊
     * @type {Block[][][]}
     */
    this._pg = Array.from({ length: xLen }, (_, x) => 
      Array.from({ length: yLen }, (_, y) => 
        Array.from({ length: zLen }, (_, z) => y === 0 ? new OpaqueBlock({ x, y, z, engine: this }) : new AirBlock({ x, y, z, engine: this }))
      )
    );
  }

  block(x, y, z) {
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return undefined;
    return this._pg[x][y][z];
  }

  leftClick(x, y, z) {
    const block = this._pg[x][y][z];
    this._pg[x][y][z] = new AirBlock({ x, y, z, engine: this });
    this._update(x, y, z);
    return block;
  }

  rightClick(x, y, z, B) {
    this._pg[x][y][z] = new B({ x, y, z, engine: this });
    this._update(x, y, z);
  }

  _update(x, y, z) {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        for (let k = z - 1; k <= z + 1; k++) {
          this.block(i, j, k)?.update();
        }
      }
    }
  }
}

export default Engine;