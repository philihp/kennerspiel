[![Version](https://img.shields.io/npm/v/hathora-et-labora-game.svg)](https://www.npmjs.com/package/hathora-et-labora-game)
[![Tests](https://github.com/philihp/hathora-et-labora/actions/workflows/game.yml/badge.svg)](https://github.com/philihp/hathora-et-labora/actions/workflows/game.yml)
[![Coverage](https://coveralls.io/repos/github/philihp/hathora-et-labora/badge.svg?branch=main)](https://coveralls.io/github/philihp/hathora-et-labora?branch=main)
![Downloads](https://img.shields.io/npm/dt/hathora-et-labora-game)
![License](https://img.shields.io/npm/l/hathora-et-labora-game)

## Hathora-et-Labora Game Logic Library

This is a state engine for playing a game of [Ora et Labora](https://amzn.to/3P1UYDe). I'm working on a UI for this, but
at a minimal level every client and player should agree on the rules expressed by these state transforms. Keeping state-transition
logic separate from UI should also make it simpler to build an offline trainer algorithm to develop a model to play the game against.

Each game state should start out with a state

```js
import { initialState, GameStateSetup } from 'hathora-et-labora-game'

const s0: GameStateSetup = initialState
```

From here, the game is of type `GameStateSetup`, and various configuration can happen before it starts, where the number of players are set, and the game config dictates which country variant and the game length.

```js
import { reducer, GameConfigPlayers, GameConfigLength, GameConfigCountry, GameStateSetup } from 'hathora-et-labora-game'

const players = 3
const length = 'long'
const country 'france'

const s1 = reducer(state, ['CONFIG', players, length, country]) as GameStateSetup
```

You could continue to send more `CONFIG` commands at it if the user decides to change the parameters of the game, but when you're ready to begin issue a `START`. Seed should be a string that parses into a number. Colors should be one of these 4 characters, where your players might have chosen a color. These colors will be shuffled according to seed, and in the solitare game an additional player will be created of one of the colors not chosen by the player. That's really all that's random in this game, but that random state is there if a new country variant had a card that needed it.

```js
import { GameStatePlaying } from 'hathora-et-labora-game'

const seed = '12345'
const colors = ['R', 'G', 'B', 'W']
const s2 = reducer(state, ['START', seed, ...colors]) as GameStatePlaying
```

After this point, we can use a function `control` to help figure out what possible next moves are available, which could either steer a new player into seeing what moves they might be able to do, or guide some kind of computer player into enumerating all of its possible moves. **reducer and control are functionally pure**, which makes it easy for a bot to explore down any state transition.

```js
import { control } from 'hathora-et-labora-game'

const partialCommand: string[] = []
const playerIndex: number = 0
const { completion, partial, active, flow } = control(state, partialCommand, playerIndex)
```

Control returns some attributes here which can be helpful calculated metadata to the UI regarding board state. The idea here is that we want to help the user write their next command/move.

- `completion` - a list of strings which could be the prefix of the next command from the user.
- `partial` - this is a list of strings when `join(' ')`'ed together would form the next command. It is expected that one of the strings from `completion` might be appended to this. If the empty string `""` is included in this list, then the current partial command could be sent as-is. For example, `"USE LR1"` could be the next command to use the player's Clay Mound, or the player could also do `"USE LR1 Jo"` to use it with the Joker.
- `active` - boolean specifying if the playerIndex given is the active player. If true, the client should be prompting the player for a move. If false, the client should more or less be in observation mode, it's someone else's turn.
- `flow` - a list of upcoming game frames, described with
  - `round` - the number of the round
  - `player` - the color of the player who will be active for this frame
  - `settle` - true if this frame is a settlement round; player should not expect to have a main action, and will mostly just convert or settle or buy land.
  - `bonus` - true if this frame is a bonus round at the end fo the game; during this frame, you'll get your Prior back and can place it on another player's building, regardless if that building is occupied.

A typical flow might look like this:

```js
const c2a = control(s2, [], 0)
// { partial: [], completion: ['BUILD', 'USE', 'CUT_PEAT', 'FELL_TREES'], ... }
const c2b = control(s2, ['USE'], 0)
// { partial: ['USE'], completion: ['LR1', 'LR2', 'LR3'], ... }
const c2c = control(s2, ['USE', 'LR3'], 0)
// { partial: ['USE', 'LR3'], completion: ['', 'Jo'], ... }
const s3 = reducer(s2, ['USE', 'LR3'])
const c3a = control(s3, [], 0)
// { partial: [], completion: ['COMMIT'] }
const c3b = control(s3, ['COMMIT'], 0)
// { partial: ['COMMIT'], completion: [''] }
const s4 = reducer(s3, ['COMMIT'])
```

There's no guarantee that a path down partial commands with `control` won't hit a dead end. The aim here is to keep `control` fast, and allow the player
to use their own brain a little bit. Paths down `USE` should all be valid, because the rules state it is possible to use a building without actually using it. However you might have `BUILD` offered if there are some buildings that could be built, but I haven't checked that there exists a place for them to be built. In other words, it might be that you can afford to build the Cloister Workshop, but you don't have an open plot next to another Cloister building, which would become apparent when it comes time to pick the coordinates for building.

Because of this, it's important to have some way in the client for the player to restart the move. If `reducer` is ever sent a move that is actually invalid, the next state returned should be `undefined`, indicating that an invalid move was taken.
