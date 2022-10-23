const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  hashedPassword: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  workouts: { type: [], required: false },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
