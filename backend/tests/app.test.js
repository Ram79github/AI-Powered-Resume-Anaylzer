import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5000';
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/resume-analyzer-test';
  process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long';
  process.env.CLIENT_URL = 'http://localhost:5173';
  ({ default: app } = await import('../src/app.js'));
});

describe('API foundation', () => {
  it('returns a successful health response', async () => {
    await request(app).get('/api/health').expect(200, { status: 'ok' });
  });

  it('rejects invalid signup input without accessing the database', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'short', extra: 'rejected' })
      .expect(400);

    expect(response.body.error.message).toBe('Validation failed');
  });

  it('rejects oversized JSON with a client error', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A'.repeat(110 * 1024) })
      .expect(413);

    expect(response.body.error.message).toBe('Request payload is too large');
  });

  it('protects analysis and history endpoints', async () => {
    await request(app).post('/api/analyze/text').send({}).expect(401);
    await request(app).get('/api/history').expect(401);
  });

  it('returns the standard not-found error shape', async () => {
    const response = await request(app).get('/api/missing').expect(404);

    expect(response.body).toEqual({ error: { message: 'Route not found' } });
  });
});
