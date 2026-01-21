import tseslint from 'typescript-eslint';
import globals from 'globals';

import baseConfig from '../../eslint.config.mjs';

export default tseslint.config(
  ...baseConfig,

  {
    files: ['**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
