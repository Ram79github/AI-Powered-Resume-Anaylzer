import { z } from 'zod';

export const analysisSchema = z
  .object({
    jobTitle: z.string().trim().max(120).optional().default('Target role'),
    jobDescription: z.string().trim().min(50).max(20000),
    resumeText: z.string().trim().min(100).max(50000).optional(),
  })
  .strict();

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
