[![Hathora Deploy](https://github.com/philihp/hathora-et-labora/actions/workflows/deploy.yml/badge.svg)](https://github.com/philihp/hathora-et-labora/actions/workflows/deploy.yml)
[![Coverage Status](https://coveralls.io/repos/github/philihp/hathora-et-labora/badge.svg?branch=main)](https://coveralls.io/github/philihp/hathora-et-labora?branch=main)

# Hathora et Labora

This is an implementation of Uwe Rosenberg's game [Ora et Labora](https://amzn.to/3P1UYDe), built on the [Hathora](https://hathora.dev/) platform. Some interesting waypoints might be:

- [`game`](https://github.com/philihp/hathora-et-labora/tree/main/game) - a stateless game logic library, available on [npm](https://www.npmjs.com/package/hathora-et-labora-game) licensed under GPL-3.
- [`server`](https://github.com/philihp/hathora-et-labora/blob/main/server/) - server logic. Trying to keep this thin because of complications in running automated tests on it.
- [`client/web`](https://github.com/philihp/hathora-et-labora/tree/main/client/web) - a web client built in React.
  - [`src/context/GameContext.tsx`](https://github.com/philihp/hathora-et-labora/blob/main/client/web/src/context/GameContext.tsx) - the main interface that React uses to talk to server logic. Start here if you're working on connection issues.
  - [`src/components/StatePlaying.tsx`](https://github.com/philihp/hathora-et-labora/blob/main/client/web/src/components/StatePlaying.tsx) - the root of the page where players play the game. Start here if you're trying to work on the game itself.
