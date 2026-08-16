export default {
  "**/*.{ts,tsx,js,jsx}": [
    "prettier --write",
    "oxlint --fix",
  ],
  "**/*.{json,html}": [
    "prettier --write",
  ]
}
