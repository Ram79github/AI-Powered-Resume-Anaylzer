import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(254),
    password: z.string().min(10).max(72).refine(
      (password) => Buffer.byteLength(password, 'utf8') <= 72,
      'Password must be no more than 72 UTF-8 bytes',
    ),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(72).refine(
      (password) => Buffer.byteLength(password, 'utf8') <= 72,
      'Password must be no more than 72 UTF-8 bytes',
    ),
  })
  .strict();
