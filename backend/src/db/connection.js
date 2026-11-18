import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectToDatabase() {
  await mongoose.connect(env.MONGODB_URI + (env.DB_NAME ? `/${env.DB_NAME}` : ''));
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}
