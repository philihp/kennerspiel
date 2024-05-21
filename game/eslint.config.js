import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import jest from 'eslint-plugin-jest'

export default tseslint.config(
  {
    // rules for all files
    files: ['src/**/*.ts'],
    extends: [
      // standard eslint rules
      eslint.configs.recommended,
      // and then eslint
      ...tseslint.configs.recommended,
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
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  }
)
