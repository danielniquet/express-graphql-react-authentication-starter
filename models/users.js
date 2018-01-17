import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "El campo usuario es requerido"]
  },
  password: String,
  name: String,
  StudentID: String,
  confirmed: Boolean,
  active: {
    type: Boolean,
    default: false,
  },
  isTeacher: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

const userModel = mongoose.model('User', userSchema)

export default userModel;
