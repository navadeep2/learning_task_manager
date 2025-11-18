const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'teacher'] },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Only for students
});
module.exports = mongoose.model('User', userSchema);
