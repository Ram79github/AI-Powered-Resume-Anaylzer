import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true, select: false },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
