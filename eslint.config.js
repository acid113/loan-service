import { resolve } from 'path';
import js from '@eslint/js';
import n from 'eslint-plugin-n';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  n.configs['flat/recommended'],
  {
    ignores: ['eslint.config.js', 'dist'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'n/no-missing-import': [
        'error',
        {
          resolvePaths: [resolve(__dirname, 'src')],
        },
      ],
      'n/no-unpublished-import': [
        'error',
        {
          ignoreTypeImport: true,
        },
      ],
    },
  },
  eslintConfigPrettier,
];
