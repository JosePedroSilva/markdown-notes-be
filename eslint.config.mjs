import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'no-console': 'error',
      'no-duplicate-imports': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-var': 'error',
      'no-unused-vars': 'error',
    }
  },
  {
    ignores: ['**/node_modules/**', 'logger.js', '**/__tests__/**'],
  }
];