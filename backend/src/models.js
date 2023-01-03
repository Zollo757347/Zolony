import mongoose from "mongoose";
const Schema = mongoose.Schema

const MapSchema = new Schema({
  mapName: {type: String, required: [true, 'map name is required.']},
  xLen: {type: Number, required: [true, 'x is required.']},
  yLen: {type: Number, required: [true, 'y is required.']},
  zLen: {type: Number, required: [true, 'z is required.']},
  playground: [[[{
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
  }]]],
})

const MapModel = mongoose.model('Map', MapSchema);

const UserSchema = new Schema({
  name: { type: String, required: [true, 'Name field is required.'] },
  password: { type: String, required: [true, 'password is required.']},
  avatar: { type: String, required: [true, 'picture url is required.']},
  maps: [{ type: mongoose.Types.ObjectId, ref: 'Map'}]
})

const UserModel = mongoose.model('User', UserSchema);

export  {MapModel, UserModel}