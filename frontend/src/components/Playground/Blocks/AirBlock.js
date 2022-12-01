import Block from "./Block";

/**
 * 代表一個空氣方塊
 */
class AirBlock extends Block {
  constructor({ x, y, z, engine }) {
    super({ x, y, z, engine, type: 0, transparent: true });
  }

  surfaces() {
    throw new Error('Air block does not have any surfaces.');
  }

  surfaceTexture() {
    throw new Error('Air block does not have any surface textures.');
  }

  PPUpdate() {}
}

export default AirBlock;