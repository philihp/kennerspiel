import path from 'path'

const buildOxlintCommand = (filenames) =>
  `oxlint --fix ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(' ')}`

export default {
  '**/*.{json,html}': ['prettier --write'],
  '**/*.{js,jsx}': ['prettier --write', buildOxlintCommand],
  '**/*.{ts,tsx}': ['prettier --write', buildOxlintCommand],
}
