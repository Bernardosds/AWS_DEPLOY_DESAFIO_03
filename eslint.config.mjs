import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-console': 'warn',
    },
    ignores: ['node_modules/', 'build/', '*.js'],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
