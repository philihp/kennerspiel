// Move generation over the completion-tree the engine exposes via completions().
//
// completions(state, partial) returns the legal next *tokens* after a partial
// command; an empty-string token ('') means `partial` is itself a complete,
// submittable command. So a full legal move = a path from [] down to a '' leaf.
// (completions() is control()'s completion enumeration without the flow/score
// work — see docs/trainer/07-engine-fast-paths.md.)
//
// Two generators:
//  - enumerateMoves: DFS the whole tree → every legal complete command. Has
//    curation caps because some commands (SETTLE/USE resource combos) explode
//    into 1000+ variants; the tree expander uses these.
//  - sampleMove: random walk down the tree → one legal command WITHOUT
//    enumerating. Rollouts use this to dodge the branching blow-up entirely.

import { completions } from 'hathora-et-labora-game'
import type { GameState } from 'hathora-et-labora-game'
import { apply, type Move } from './engine'
import { choice, type Rng } from './rng'

export type EnumerateOpts = {
  // cap on how many child tokens to expand at each drill-down level
  maxPerLevel?: number
  // hard cap on total complete moves returned
  maxMoves?: number
}

export type EnumerateResult = { moves: Move[]; truncated: boolean }

export const enumerateMovesInfo = (state: GameState, opts: EnumerateOpts = {}): EnumerateResult => {
  const maxPerLevel = opts.maxPerLevel ?? Infinity
  const maxMoves = opts.maxMoves ?? Infinity
  const out: Move[] = []
  let truncated = false

  const dfs = (partial: string[]): void => {
    if (out.length >= maxMoves) {
      truncated = true
      return
    }
    const completion = completions(state, partial)
    if (completion.includes('')) out.push(partial)
    const nexts = completion.filter((t) => t !== '')
    if (nexts.length > maxPerLevel) truncated = true
    const limited = maxPerLevel < nexts.length ? nexts.slice(0, maxPerLevel) : nexts
    for (const tok of limited) {
      if (out.length >= maxMoves) {
        truncated = true
        return
      }
      dfs([...partial, tok])
    }
  }

  dfs([])
  return { moves: out, truncated }
}

export const enumerateMoves = (state: GameState, opts?: EnumerateOpts): Move[] =>
  enumerateMovesInfo(state, opts).moves

// Sample one legal move by walking the completion tree randomly. Avoids
// enumerating the (sometimes huge) action set — ideal for playouts. Verifies
// the result applies (the engine occasionally offers '' on a not-yet-valid
// partial), retrying a few times, then falls back to a capped enumeration.
export const sampleMove = (state: GameState, rng: Rng, maxDepth = 16): Move | undefined => {
  for (let attempt = 0; attempt < 8; attempt++) {
    const partial: string[] = []
    let walked = true
    for (let depth = 0; depth < maxDepth; depth++) {
      const completion = completions(state, partial)
      if (completion.length === 0) {
        walked = false
        break
      }
      const tok = choice(rng, completion)
      if (tok === '') break // partial is now a complete command
      partial.push(tok)
    }
    if (walked && partial.length > 0 && apply(state, partial) !== undefined) return partial
  }
  // Fallback: enumerate (capped) and pick — guarantees a legal move if one exists.
  const all = enumerateMoves(state, { maxPerLevel: 64, maxMoves: 512 })
  return all.length > 0 ? choice(rng, all) : undefined
}
