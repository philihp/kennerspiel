export default {
  "**/*.{ts,tsx,js,jsx}": [
    "prettier --write",
    "eslint --fix",
  ],
  "**/*.{json,html}": [
    "prettier --write",
  ]
}
