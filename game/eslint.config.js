import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import jestPlugin from 'eslint-plugin-jest'

export default tseslint.config(
  {
    // rules for all files
    files: ['src/**/*.ts'],
    extends: [
      // standard eslint rules
      eslint.configs.recommended,
      // and then eslint
      ...tseslint.configs.recommendedTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      },
      // disable eslint rules that conflict with prettier
      eslintConfigPrettier,
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    // rules specifically for tests
    files: ['src/**/__tests__/*.test.ts'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      '@typescript-eslint/no-unsafe-return': 'off',
      'jest/prefer-expect-assertions': 'off'
    },
  }
)
