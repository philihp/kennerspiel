import path from 'path'

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(' ')}`

export default {
  '**/*.{json,html}': ['prettier --write'],
  '**/*.{js,jsx}': ['prettier --write', buildEslintCommand],
  '**/*.{ts,tsx}': ['prettier --write', buildEslintCommand],
}
