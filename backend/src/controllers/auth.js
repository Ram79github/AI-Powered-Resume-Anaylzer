import * as authService from '../services/auth.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
};

function setSessionCookies(res, user) {
  const tokens = authService.createSessionTokens(user);
  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', tokens.refreshToken, {
    ...cookieOptions,
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  setSessionCookies(res, user);
  res.status(201).json({ data: { user } });
});

export const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body.email, req.body.password);
  setSessionCookies(res, user);
  res.json({ data: { user } });
});

export const refresh = asyncHandler(async (req, res) => {
  const user = await authService.refreshSession(req.cookies.refreshToken);
  setSessionCookies(res, user);
  res.json({ data: { user: { id: user.id, name: user.name, email: user.email } } });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?.id) await authService.revokeSessions(req.user.id);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', { ...cookieOptions, path: '/api/auth/refresh' });
  res.json({ data: { message: 'Signed out' } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('name email').lean();
  res.json({ data: { user } });
});
