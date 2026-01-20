import tseslint from 'typescript-eslint';

import baseConfig from '../../eslint.config.mjs';

export default tseslint.config(...baseConfig, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
