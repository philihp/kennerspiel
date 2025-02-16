import path from 'path'

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`

export default {
  '**/*.{json,html}': ['prettier --write'],
  '**/*.{ts,tsx,js,jsx}': ['prettier --write', buildEslintCommand],
}
