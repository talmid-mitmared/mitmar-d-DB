const js = require('@eslint/js');
const globals = require('globals');
const ts = require('typescript-eslint');

module.exports = [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: ['dist/'],
  },
];
