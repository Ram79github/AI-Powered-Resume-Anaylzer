import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

function createToken(user, expiresIn, type) {
  return jwt.sign({ sub: user.id, tokenVersion: user.tokenVersion, type }, env.JWT_SECRET, { expiresIn });
}

export async function register(data) {
  const password = await bcrypt.hash(data.password, 12);
  const user = await User.create({ name: data.name, email: data.email.toLowerCase(), password });
  return { id: user.id, name: user.name, email: user.email, tokenVersion: user.tokenVersion };
}

export async function login(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +tokenVersion');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  return { id: user.id, name: user.name, email: user.email, tokenVersion: user.tokenVersion };
}

export function createSessionTokens(user) {
  return {
    accessToken: createToken(user, ACCESS_TOKEN_TTL, 'access'),
    refreshToken: createToken(user, REFRESH_TOKEN_TTL, 'refresh'),
  };
}

export async function refreshSession(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Please sign in again');
  }
  if (payload.type !== 'refresh') throw new ApiError(401, 'Please sign in again');
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new ApiError(401, 'Please sign in again');
  }
  return { id: user.id, name: user.name, email: user.email, tokenVersion: user.tokenVersion };
}

export async function revokeSessions(userId) {
  await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.type !== 'access') throw new ApiError(401, 'Please sign in again');
  return payload;
}
