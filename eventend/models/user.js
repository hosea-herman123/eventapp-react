import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer', 'employee'], default: 'customer' },
   settings: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
