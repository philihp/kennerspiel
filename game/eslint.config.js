// "eslint-import-resolver-typescript": "3.6.1",
// "eslint-plugin-import": "2.29.1",
// "eslint-plugin-jest": "28.0.0",
// "eslint-plugin-prettier": "5.1.3",
// "@typescript-eslint/eslint-plugin": "7.8.0",
// "@typescript-eslint/parser": "7.8.0",

import eslint from '@eslint/js'
import jestPlugin from 'eslint-plugin-jest'
import tseslint from 'typescript-eslint'
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  {
    ignores: ['**/dist/**', 'eslint.config.js'],
  },
  {
    files: ['src/**/*.ts'],
    extends: [
      //
      eslint.configs.recommended,
      // eslintPluginPrettierRecommended,
      ...tseslint.configs.recommended
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
      // '@typescript-eslint/no-unused-vars': [
      //   'error',
      //   {
      //     argsIgnorePattern: '^_',
      //     varsIgnorePattern: '^_',
      //     caughtErrorsIgnorePattern: '^_',
      //   },
      // ],
    },
  },
  {
    files: ['src/**/__tests__/*.ts', 'src/**/*.test.ts'],
    extends: [jestPlugin.configs['flat/recommended']],
  }
)



// "eslintConfig": {
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "project": "./tsconfig.json"
//   },
//   "plugins": [
//     "@typescript-eslint"
//   ],
//   "extends": [
//     "plugin:@typescript-eslint/recommended",
//     "@philihp"
//   ],
//   "settings": {
//     "react": {
//       "version": "9999"
//     },
//     "import/extensions": [
//       ".ts"
//     ],
//     "import/parsers": {
//       "@typescript-eslint/parser": [
//         ".ts"
//       ]
//     },
//     "import/resolver": {
//       "typescript": {},
//       "node": {
//         "extensions": [
//           ".ts"
//         ]
//       }
//     }
//   },
//   "rules": {
//     "@typescript-eslint/no-unused-vars": "off",
//     "class-methods-use-this": "off",
//     "default-case": "off",
//     "no-param-reassign": "off",
//     "no-restricted-syntax": "off",
//     "no-unused-vars": "off"
//   },
//   "overrides": [
//     {
//       "files": [
//         "**/__tests__/*"
//       ],
//       "rules": {
//         "@typescript-eslint/no-non-null-assertion": "off",
//         "indent":"off"
//       }
//     }
//   ]
// }
