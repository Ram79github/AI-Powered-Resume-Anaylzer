import { describe, expect, it } from 'vitest';
import { registerSchema } from '../src/validators/auth.js';

describe('registerSchema', () => {
  it("rejects passwords that exceed bcrypt's 72-byte input limit", () => {
    const result = registerSchema.safeParse({
      name: 'Sam',
      email: 'sam@example.com',
      password: `${'a'.repeat(70)}éé`,
    });

    expect(result.success).toBe(false);
  });
});
