import mongoose from "mongoose";
const Schema = mongoose.Schema

const MapSchema = new Schema({
  mapName: {type: String, required: [true, 'map name is required.']},
  xLen: {type: Number, required: [true, 'x is required.']},
  yLen: {type: Number, required: [true, 'y is required.']},
  zLen: {type: Number, required: [true, 'z is required.']},
  belonging: { type: mongoose.Types.ObjectId, ref: 'User'},
  validation: {
    levers: [[ { type: Number } ]],
    lamps: [[ { type: Number } ]],
    boolFuncs: [[[ { type: Number} ]]],
    timeout: { type: Number },
  },
  playground: [[[{
    blockName: { type: String },
    type: { type: Number },
    breakable: { type: Boolean },
    states: {
      power: { type: Number },
      source: { type: Boolean },

      delay: { type: Number },
      facing: { type: String },
      locked: { type: Boolean },
      powered: { type: Boolean },

      lit: { type: Boolean },

      east: { type: Number },
      south: { type: Number },
      west: { type: Number },
      north: { type: Number },
    }
  }]]],
})

const MapModel = mongoose.model('Map', MapSchema); 

const UserSchema = new Schema({
  name: { type: String, required: [true, 'Name field is required.'] },
  password: { type: String, required: [true, 'password is required.']},
  avatar: { type: String, required: [true, 'picture url is required.']},
  level: [{type: Boolean}],
  bio: { type: String, required: [true, 'bio field is required.'] },
  maps: [{ type: mongoose.Types.ObjectId, ref: 'Map'}]
})

const UserModel = mongoose.model('User', UserSchema);

export  {MapModel, UserModel}