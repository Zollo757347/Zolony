import mongoose from "mongoose";
const Schema = mongoose.Schema
// User Schema 

const UserSchema = new Schema({
  name: { type: String, required: [true, 'Name field is required.'] },
  password: { type: String, required: [true, 'password is required.']},
  avatar: { type: String, required: [true, 'picture url is required.']},
  maps: [{ type: mongoose.Types.ObjectId, ref: 'Map'}]
})

const UserModel = mongoose.model('User', UserSchema);

export default UserModel