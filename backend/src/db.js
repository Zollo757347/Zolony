import { BlockType } from "../../frontend/src/classes/Playground/BlockType";

const maps = [
  {
    mapName: 'map1',
    xLen: 5,
    yLen: 5,
    zLen: 5,
    playground: [[[{
            blockdata: {
                x: 0,
                y: 0,
                z: 0,
                blockName: 'concrete',
                type: BlockType.Concrete,
                status: {
                  power: 0,
                  source: false,
                }
            }
          },{
            blockdata: {
                x: 0,
                y: 0,
                z: 1,
                blockName: 'concrete',
                type: BlockType.Concrete,
                status: {
                  power: 0,
                  source: false,
                }
            }
          },{
            blockdata: {
                x: 0,
                y: 0,
                z: 2,
                blockName: 'concrete',
                type: BlockType.Concrete,
                status: {
                  power: 0,
                  source: false,
                }
            }
          },{
            blockdata: {
                x: 0,
                y: 0,
                z: 3,
                blockName: 'concrete',
                type: BlockType.Concrete,
                status: {
                  power: 0,
                  source: false,
                }
            }
          },{
            blockdata: {
                x: 0,
                y: 0,
                z: 4,
                blockName: 'concrete',
                type: BlockType.Concrete,
                status: {
                  power: 0,
                  source: false,
                }
            }
          }
        ],[{
          blockdata: {
              x: 0,
              y: 0,
              z: 0,
              blockName: 'concrete',
              type: BlockType.Concrete,
              status: {
                power: 0,
                source: false,
              }
          }
        },{
          blockdata: {
              x: 0,
              y: 0,
              z: 1,
              blockName: 'concrete',
              type: BlockType.Concrete,
              status: {
                power: 0,
                source: false,
              }
          }
        },{
          blockdata: {
              x: 0,
              y: 0,
              z: 2,
              blockName: 'concrete',
              type: BlockType.Concrete,
              status: {
                power: 0,
                source: false,
              }
          }
        },{
          blockdata: {
              x: 0,
              y: 0,
              z: 3,
              blockName: 'concrete',
              type: BlockType.Concrete,
              status: {
                power: 0,
                source: false,
              }
          }
        },{
          blockdata: {
              x: 0,
              y: 0,
              z: 4,
              blockName: 'concrete',
              type: BlockType.Concrete,
              status: {
                power: 0,
                source: false,
              }
          }
        }
      ],
      ], [], [], [], []
    ]
  }
]






const MapSchema = new Schema({
    mapName: {type: String, required: [true, 'map name is required.']},
    xLen: {type: Number, required: [true, 'x is required.']},
    yLen: {type: Number, required: [true, 'y is required.']},
    zLen: {type: Number, required: [true, 'z is required.']},
    playground: [[[{
      blockdata: {
        x: Number,
        y: Number,
        z: Number,
        blockName: String,
        type: Number,
        states: {
          power: Number,
          source: Boolean,
  
          delay: Number,
          facing: String,
          locked: Boolean,
          powered: Boolean,
  
          lit: Boolean,
  
          east: Number,
          south: Number,
          west: Number,
          north: Number,
        }
      }
    }]]],
  })



  const db = {
    maps
  };

  export { db as default};