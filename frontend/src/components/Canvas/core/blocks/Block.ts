import { NewBlock, Maps } from "../utils";
import { BlockData, BlockOptions, BlockSpawnOptions, BlockStates, BlockType, Blocks, FourFacings, PowerTransmission, SixSides, ThreeFaces, WebGLTextureData } from "../../typings/types";
import Engine from "../../Engine";

/**
 * 代表一個方塊
 */
abstract class Block {
  public x: number;
  public y: number;
  public z: number;

  public engine: Engine;


  public breakable: boolean;
  public interactable: boolean;

  public transparent: boolean;
  public fullBlock: boolean;
  public upperSupport: boolean;
  public bottomSupport: boolean;
  public sideSupport: boolean;
  public needSupport: boolean;
  public needBottomSupport: boolean;

  public redstoneAutoConnect: "full" | "line" | "none";

  public abstract type: BlockType;
  public abstract blockName: string;
  public abstract states: BlockStates;

  public abstract get textures(): WebGLTextureData[];
  public abstract get outlines(): number[];

  constructor(options: BlockOptions) {
    this.x = options.x;
    this.y = options.y;
    this.z = options.z;

    this.engine = options.engine;

    this.breakable = options.breakable || true;
    this.interactable = options.interactable || false;

    this.transparent = options.transparent || false;
    this.fullBlock = options.fullBlock || false;
    this.upperSupport = options.fullSupport || options.upperSupport || false;
    this.bottomSupport = options.fullSupport || options.bottomSupport || false;
    this.sideSupport = options.fullSupport || options.sideSupport || false;
    this.needSupport = options.needSupport || false;
    this.needBottomSupport = options.needBottomSupport || false;

    this.redstoneAutoConnect = options.redstoneAutoConnect ?? 'none';
  }

  /**
   * 用給定的方塊資料生出方塊
   */
  static spawn({ x, y, z, type, states, breakable, engine }: BlockSpawnOptions): Blocks {
    const block = new (NewBlock(type))({ x, y, z, engine });
    block.breakable = breakable || false;
    block.states = states;
    return block;
  }

  /**
   * 把一個方塊轉換成可儲存的資料形式
   */
  static extract(block: Block): BlockData {
    const states = JSON.parse(JSON.stringify(block.states));
    delete states.__typename;
    return {
      type: block.type, 
      breakable: block.breakable, 
      states: states
    };
  }

  /**
   * 取得此方塊的充能強度
   */
  get power() {
    return this.states.power;
  }

  /**
   * 取得此方塊對指定方向導線元件外的方塊的能量輸出情形，只能被導線元件（紅石粉、紅石中繼器、紅石比較器）以外的方塊呼叫
   */
  powerTowardsBlock(_direction: SixSides): PowerTransmission {
    return { strong: false, power: 0 };
  }

  /**
   * 取得此方塊對指定方向導線元件的能量輸出情形，只能被導線元件（紅石粉、紅石中繼器、紅石比較器）呼叫
   */
  powerTowardsWire(_direction: SixSides): PowerTransmission {
    return { strong: this.states.source, power: this.states.power };
  }

  /**
   * 發送 Post Placement Update 到相鄰的方塊
   */
  sendPPUpdate() {
    this.engine.needRender = true;
    
    this.PPUpdate();
    Maps.P6DArray.forEach(([, [x, y, z]]) => {
      this.engine.block(this.x + x, this.y + y, this.z + z)?.PPUpdate();
    });
  }

  /**
   * 根據 Post Placement Update 的來源方向更新自身狀態
   * @abstract
   */
  PPUpdate() {
    if (this.needBottomSupport) {
      if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
        this.engine._leftClick(this.x, this.y, this.z);
        return;
      }
    }

    if (this.needSupport && 'face' in this.states && 'facing' in this.states) {
      const face = this.states.face as ThreeFaces
        ?? (this.states.facing === 'up' ? 'floor' : 'wall');
      let broken = false;
      switch (face) {
        case 'ceiling':
          if (!this.engine.block(this.x, this.y + 1, this.z)?.bottomSupport) {
            broken = true;
          }
          break;
  
        case 'floor':
          if (!this.engine.block(this.x, this.y - 1, this.z)?.upperSupport) {
            broken = true;
          }
          break;
  
        case 'wall':
          const facing = this.states.facing as FourFacings;
          const dir = Maps.P4DMap[Maps.ReverseDir[facing]];
          if (!dir) {
            throw new Error(`${this.states.facing} is not a valid direction.`);
          }
  
          const [x, , z] = dir;
          if (!this.engine.block(this.x + x, this.y, this.z + z)?.sideSupport) {
            broken = true;
          }
          break;
  
        default: break;
      }

      if (broken) {
        this.engine._leftClick(this.x, this.y, this.z);
        return;
      }
    }
  }
}

export default Block;