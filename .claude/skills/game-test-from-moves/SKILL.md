---
name: game-test-from-moves
description: Use this skill when the user pastes a list of game commands (the Ora et Labora move log — CONFIG/START/BUILD/USE/COMMIT/WORK_CONTRACT/WITH_LAYBROTHER/etc.) and asks you to "create a test case", "write a test", "reproduce a game", or investigate suspected bugs in a specific in-progress game. Produces a Node test under `game/src/__tests__/` that replays the moves through the reducer and asserts on the resulting state and `control()` completions.
---

# Creating a game-replay test for Ora et Labora

This game engine (`game/src/`) is a pure reducer over string-token commands. Any game state is reproducible by feeding the move log through `reducer(state, tokens)`. This skill makes that test repeatable.

## Where the test goes

- File: `game/src/__tests__/<descriptive-name>.test.ts`
- Pattern: copy the structure of `game/src/__tests__/gameClaude4.test.ts` or `gameClaude4-1.test.ts`. Both use a single `reduce` over the move list — that's far more compact than the long `s1/s2/s3/...` chains in `game21872.test.ts`. Prefer the compact `reduce` form unless you need to assert state at specific intermediate moves.

## File template

```ts
import { describe, it, expect } from '../testHelpers'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { GameState, GameStatePlaying } from '../types'
import { control } from '../control'
import { map, reduce, split } from 'ramda'

describe('<game name or instance id>', () => {
  it('<what is being verified>', () => {
    const s0 = initialState
    const moves: string[][] = map(split(' '), [
      'CONFIG 2 france long',
      'START 98369 R W',
      // ...every move from the user's log, one per array entry, exactly as given
      'WORK_CONTRACT G26 Wn',
    ])
    const sN = reduce<string[], GameState>(
      (state, move) => reducer(state, move)!,
      s0,
      moves,
    ) as GameStatePlaying
    expect(sN).toBeDefined()

    // Now assert what the user is asking about. Examples:
    const c = control(sN, [])
    expect(c.completion).toContain('WITH_LAYBROTHER')
  })
})
```

## Rules for translating the user's move log

1. **Each line in their pasted log is one `reducer` call.** Split by newline, then by spaces — never merge lines, never split a single line further. A line like `USE G02 PtSwMt Cl` is a single command (`command=USE`, `building=G02`, `params=['PtSwMt','Cl']`).
2. **Preserve token order verbatim** — including resource bundles like `BrBrCoFlFlFlFlFl`. The reducer parses those (see `parseResourceParam` in `game/src/board/resource.ts`); do not re-split them.
3. **Keep modal commands as their own lines.** `WITH_LAYBROTHER` and `WITH_PRIOR` are standalone moves that follow `WORK_CONTRACT` or (rarely) `BUILD`. Do not collapse them into the previous line.
4. **Stop where the user stopped.** If the log ends mid-frame (e.g. last line is `WORK_CONTRACT G26 Wn` with no `COMMIT`), that's intentional — the user wants to inspect the state at that decision point. Do not invent moves to "finish" the frame.
5. **CONFIG/START line shape:**
   - `CONFIG <players:1|2|3|4> <ireland|france> <short|long>`
   - `START <seed-or-color> [<colors...>]` — if the first token after START is numeric it's a seed; otherwise the colors start immediately. Mirror exactly what the user gave.

## What to assert

The user almost always wants one of:

- **"Is X a legal move here?"** → assert against `control(state, partial).completion`:
  ```ts
  const c = control(sN, [])              // top-level verbs
  expect(c.completion).toContain('USE')
  const cUse = control(sN, ['USE'])      // drill down
  expect(cUse.completion).toContain('G26')
  ```
- **"Why is X failing?"** → call `reducer(sN, ['USE','G26', ...])` and assert defined/undefined. `undefined` from the reducer means the move was rejected.
- **"Who's the active player?"** → assert on `sN.frame.activePlayerIndex` and `sN.frame.currentPlayerIndex`. After `WITH_LAYBROTHER`/`WITH_PRIOR`, active should revert to current.
- **Frame progression** → `sN.frame.next`, `sN.frame.settlementRound`, `sN.frame.startingPlayer`.

## Running it

From the `game/` workspace:

```bash
cd /home/user/kennerspiel/game
# Run just the new test (much faster than the full suite during iteration):
node --import tsx/esm --experimental-test-module-mocks --test src/__tests__/<your-file>.test.ts
# Or via npm script (runs the whole suite):
pnpm test
```

If you see `Cannot find package 'tsx'`, run `pnpm install` in `game/` first.

## Investigating "is this a bug?" requests

When the user suspects a bug ("USE doesn't look allowed"), the test alone isn't the answer — you also need to **verify against the live engine state** when possible. If `mcp__Kennerspiel__*` tools are available and the user mentions an instance, also:

1. `mcp__Kennerspiel__list_my_games` → find the instance id.
2. `mcp__Kennerspiel__get_legal_moves` with `partial: []` → see what the engine actually offers the active player. Drill down with `["USE"]`, `["USE","G26"]`, etc.
3. Cross-check against your local test's `control(state, [])`. If both agree the move IS available, the user was mistaken about what they saw — write the test as a **regression pin** asserting the correct behavior, and tell the user the engine actually permits the move.
4. If they disagree, the bug is real — your test should `expect(...).toContain('USE')` and fail, exposing it.

## What you do NOT need to do

- Don't reformat resource bundles, don't re-order tokens, don't "clean up" the log.
- Don't add intermediate state assertions the user didn't ask for — they make the test brittle as the engine evolves. Assert only the question being investigated.
- Don't write comments explaining each move; the move list is self-documenting and the test name should explain the intent.
- Don't claim a bug exists without first checking `control().completion` and (when applicable) `get_legal_moves`.

## Worked example

User pasted a long 2-player France-long move log ending with `WORK_CONTRACT G26 Wn` and reported: "Action is back to Red, but USE doesn't look allowable — bug?" The test that captured the scenario:

```ts
import { describe, it, expect } from '../testHelpers'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { GameState, GameStatePlaying } from '../types'
import { control } from '../control'
import { map, reduce, split } from 'ramda'

describe('game Claude4-1', () => {
  it('allows USE G26 after a WORK_CONTRACT G26 -> WITH_LAYBROTHER', () => {
    const s0 = initialState
    const moves: string[][] = map(split(' '), [
      'CONFIG 2 france long',
      'START 98369 R W',
      'BUILD G07 3 0',
      'USE G07 Pt',
      'COMMIT',
      // ... full log, ending at:
      'WORK_CONTRACT G26 Wn',
    ])
    const s1 = reduce<string[], GameState>(
      (state, move) => reducer(state, move)!,
      s0,
      moves,
    ) as GameStatePlaying
    expect(s1).toBeDefined()
    expect(s1.frame.usableBuildings).toContain('G26')

    // White must pick WITH_LAYBROTHER or WITH_PRIOR
    const c1 = control(s1, [])
    expect(c1.completion).toContain('WITH_LAYBROTHER')

    // After WITH_LAYBROTHER, action returns to Red
    const s2 = reducer(s1, ['WITH_LAYBROTHER'])! as GameStatePlaying
    expect(s2.frame.activePlayerIndex).toBe(s2.frame.currentPlayerIndex)
    expect(s2.frame.usableBuildings).toContain('G26')

    // Red can USE the Shipping Company — the suspected bug does not exist
    const c2 = control(s2, [])
    expect(c2.completion).toContain('USE')
    expect(control(s2, ['USE']).completion).toContain('G26')

    const s3 = reducer(s2, ['USE', 'G26'])! as GameStatePlaying
    expect(s3).toBeDefined()
  })
})
```

Live MCP `get_legal_moves` returned `["USE", ...]` for the same state, confirming the engine was correct and there was no bug — the test pins this so any future regression breaks loudly.
