import { describe, expect, it } from 'vitest';
import { analyzeResume } from '../src/utils/analyzer.js';

describe('analyzeResume', () => {
  it('scores matched requirements and suggests missing skills', () => {
    const result = analyzeResume(
      'JavaScript, React, and Node.js developer. Improved delivery time by 25%.',
      'We need a JavaScript and React developer with Node.js and MongoDB experience. At least three years of experience required.',
    );

    expect(result.matchedKeywords).toEqual(expect.arrayContaining(['javascript', 'react', 'node.js']));
    expect(result.missingKeywords).toContain('mongodb');
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('normalizes case and returns a bounded score', () => {
    const result = analyzeResume('REACT developer', 'React experience is needed for this role with JavaScript.');

    expect(result.matchedKeywords).toContain('react');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('does not treat JavaScript as a Java match', () => {
    const result = analyzeResume('JavaScript developer', 'Java experience is required for this position.');

    expect(result.matchedKeywords).not.toContain('java');
    expect(result.missingKeywords).toContain('java');
  });
});
