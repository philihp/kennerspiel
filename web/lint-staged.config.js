export default {
  "**/*.{json,html}": ["prettier --write"],
  "**/*.{ts,tsx,js,jsx,json}": [
    "prettier --write",
    "eslint --fix",
  ]
}
