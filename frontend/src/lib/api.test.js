import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './api.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api', () => {
  it('sends JSON requests with credentials and returns the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { id: 'report-1' } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await api('/api/reports', { method: 'POST', body: { jobTitle: 'Designer' } });

    expect(result.data.id).toBe('report-1');
    expect(fetchMock).toHaveBeenCalledWith('/api/reports', expect.objectContaining({
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: '{"jobTitle":"Designer"}',
    }));
  });

  it('does not set a JSON content type for multipart requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ data: {} }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const body = new FormData();
    body.append('resume', 'resume');

    await api('/api/analyze', { method: 'POST', body });

    expect(fetchMock.mock.calls[0][1].body).toBe(body);
    expect(fetchMock.mock.calls[0][1].headers).toEqual({});
  });

  it('surfaces the API error message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Resume text is required' } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api('/api/analyze/text', { method: 'POST', body: {} }))
      .rejects.toThrow('Resume text is required');
  });
});
