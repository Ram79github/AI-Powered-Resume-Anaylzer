import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { react },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
];
