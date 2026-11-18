import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found'));
}

export function errorHandler(error, _req, res, _next) {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: { message: 'Request payload is too large' } });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Invalid JSON body' } });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: { message: 'Validation failed', details: error.issues },
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: { message: 'An account with that email already exists' } });
  }

  if (error.name === 'MulterError') {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: { message: 'Upload a PDF file no larger than 5 MB' } });
  }

  const status = error instanceof ApiError ? error.statusCode : 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({
    error: {
      message: status >= 500 ? 'Something went wrong' : error.message,
      ...(status === 400 && error.details ? { details: error.details } : {}),
    },
  });
}
