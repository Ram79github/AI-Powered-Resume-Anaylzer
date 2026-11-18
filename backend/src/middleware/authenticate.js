import User from '../models/User.js';
import { verifyAccessToken } from '../services/auth.js';
import { ApiError } from '../utils/ApiError.js';

export async function authenticate(req, _res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw new ApiError(401, 'Sign in to continue');
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('+tokenVersion').lean();
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new ApiError(401, 'Please sign in again');
    }
    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Please sign in again'));
  }
}
