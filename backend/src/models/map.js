import mongoose from "mongoose";
const Schema = mongoose.Schema

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

const MapModel = mongoose.model('Map', MapSchema);

export default MapModel