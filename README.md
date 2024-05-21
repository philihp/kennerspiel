[![Vercel](https://img.shields.io/github/deployments/philihp/kennerspiel/production?logo=vercel&label=Vercel
)](https://github.com/philihp/kennerspiel/actions/workflows/deploy.yml)
[![Coverage](https://coveralls.io/repos/github/philihp/kennerspiel/badge.svg?branch=main)](https://coveralls.io/github/philihp/kennerspiel?branch=main)

# Hathora et Labora

This is an implementation of Uwe Rosenberg's game [Ora et Labora](https://amzn.to/3P1UYDe). Some interesting waypoints might be:

- [`game`](https://github.com/philihp/kennerspiel/tree/main/game) - a stateless game logic library, available on [npm](https://www.npmjs.com/package/hathora-et-labora-game) licensed under GPL-3.
- [`web`](https://github.com/philihp/kennerspiel/blob/main/web/) - this is the website that gets shot up to Vercel.

## To Update Game Logic

The game logic must be published separately from the Docker image.

- `cd game`
- `rm -rf node_modules`
- Bump the version number of the game appropriately (e.g. v0.6.9)
- `npm install`
- `npm run build`
- `npm run test`
- `npm publish`
