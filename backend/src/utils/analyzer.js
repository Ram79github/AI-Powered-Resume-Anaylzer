const SKILLS = [
  'javascript', 'typescript', 'react', 'node.js', 'nodejs', 'express', 'mongodb', 'sql',
  'python', 'java', 'c++', 'c#', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'rest api',
  'graphql', 'html', 'css', 'tailwind', 'vite', 'machine learning', 'data analysis',
  'project management', 'communication', 'leadership', 'agile', 'scrum', 'excel',
  'power bi', 'tableau', 'figma', 'testing', 'ci/cd', 'linux', 'security',
];
const STOP_WORDS = new Set([
  'about', 'across', 'after', 'also', 'and', 'are', 'being', 'but', 'can', 'candidate',
  'ensure', 'experience', 'for', 'from', 'have', 'into', 'its', 'looking', 'must', 'our',
  'role', 'should', 'skills', 'such', 'that', 'their', 'this', 'through', 'with', 'will',
  'work', 'years', 'you', 'your', 'the', 'of', 'to', 'in', 'on', 'as', 'or', 'a', 'an',
]);

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function containsKeyword(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, 'i').test(text);
}

function extractKeywords(jobDescription) {
  const normalized = normalize(jobDescription);
  const skills = SKILLS.filter((skill) => containsKeyword(normalized, skill));
  if (skills.length) return [...new Set(skills)].slice(0, 20);

  return [...new Set(normalized.split(' ').filter((word) =>
    word.length > 3 && !STOP_WORDS.has(word) && !/^\d+$/.test(word),
  ))].slice(0, 12);
}

export function analyzeResume(resumeText, jobDescription) {
  const resume = normalize(resumeText);
  const keywords = extractKeywords(jobDescription);
  const matchedKeywords = keywords.filter((keyword) => containsKeyword(resume, keyword));
  const missingKeywords = keywords.filter((keyword) => !matchedKeywords.includes(keyword));
  const score = keywords.length ? Math.round((matchedKeywords.length / keywords.length) * 100) : 0;
  const suggestions = [];

  if (missingKeywords.length) {
    suggestions.push(`Add relevant evidence for these job requirements where accurate: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }
  if (score < 60) suggestions.push('Rewrite your summary to clearly connect your strongest experience to this target role.');
  if (!/\b\d+%?\b/.test(resume)) suggestions.push('Add measurable outcomes, such as time saved, revenue generated, or users supported.');
  if (resume.length < 500) suggestions.push('Expand your experience descriptions with specific responsibilities, tools, and outcomes.');
  if (!suggestions.length) suggestions.push('Your resume covers the main detected requirements. Tailor each experience bullet to show measurable impact.');

  return {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions,
    summary: `Your resume matches ${matchedKeywords.length} of ${keywords.length} detected job keywords.`,
  };
}
