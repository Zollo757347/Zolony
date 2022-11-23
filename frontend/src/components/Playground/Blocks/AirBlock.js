import Block from "./Block";

/**
 * 代表一個空氣方塊
 */
class AirBlock extends Block {
  constructor({ x, y, z }) {
    super({ x, y, z, type: 0 });
  }

  surface(norm) {
    throw new Error('Air block does not have any surfaces.');
  }

  surfaceTexture(norm) {
    throw new Error('Air block does not have any surface textures.');
  }
}

export default AirBlock;