// Game-agnostic GameAdapter conformance checks — the reusable form of the
// second-game acceptance ladder's gate 1 (docs/trainer/28-second-game-onboarding.md):
// every enumerated move applies, keys are unique, outcome/playerToMove hold
// their contracts mid-game, encoding is finite, and a seed replays to the
// same game. A new game's adapter runs these over its own configs before any
// search or self-play is pointed at it; the OeL adapter runs them in
// __tests__/conformance.test.ts so the checks themselves stay honest.
//
// Framework-free by design: instead of asserting, checks collect Violations
// and the caller asserts the list is empty — a failing adapter reports every
// broken invariant in one run, not just the first.

import type { Caps, GameAdapter, Rng } from './adapter'

export type ConformanceOpts = {
  seeds: number[] // one seeded random-play walk per entry
  rng: (seed: number) => Rng // seeded rng factory (e.g. pcg32)
  maxSteps?: number // walk length before giving up (default 40)
  caps?: Caps // enumeration caps (default { maxPerLevel: 24, maxMoves: 64 })
  // Run the expensive per-state checks (enumerate + apply-all + encode) only
  // every Nth step (default 1 = every state). Terminal-reaching walks pass a
  // large stride so the walk itself stays cheap.
  checkStride?: number
  // Walks must reach a terminal state within maxSteps (default false). Use
  // with a generous maxSteps to prove the terminal predicate + terminal
  // outcome contract on a real finished game.
  requireTerminal?: boolean
  // moveKey canonicalization guarantees (docs/trainer/schemas.md §2 +
  // 10-move-canonicalization.md): keys are unique across an enumeration (no
  // two enumerated moves share a key) AND contain no whitespace inside a
  // token. Default true — a new adapter must pass. OeL opts out until
  // project 10, whose `legalMoves` still uses identity canonicalization
  // (see oel.ts): the DFS can reach one reducer-identical move by several
  // paths (duplicate keys) and emits joined "col row" coordinate tokens.
  // Flipping this on is project 10's acceptance check.
  strictMoveKeys?: boolean
}

export type Violation = { seed: number; step: number; check: string; detail: string }

const MAX_VIOLATIONS = 25
const DEFAULT_CAPS: Caps = { maxPerLevel: 24, maxMoves: 64 }

export const checkConformance = <TState, TMove, TCfg>(
  adapter: GameAdapter<TState, TMove, TCfg>,
  cfg: TCfg,
  opts: ConformanceOpts
): Violation[] => {
  const out: Violation[] = []
  const caps = opts.caps ?? DEFAULT_CAPS
  const maxSteps = opts.maxSteps ?? 40
  const stride = opts.checkStride ?? 1
  const strict = opts.strictMoveKeys ?? true
  const report = (seed: number, step: number, check: string, detail: string): void => {
    if (out.length < MAX_VIOLATIONS) out.push({ seed, step, check, detail })
  }

  // Per-state contract checks. All read-only on `state`; none consume rng, so
  // running them cannot perturb the walk they're embedded in.
  const checkState = (seed: number, step: number, state: TState): void => {
    const players = adapter.numPlayers(state)
    const mover = adapter.playerToMove(state)
    if (!Number.isInteger(mover) || mover < 0 || mover >= players)
      report(seed, step, 'player-to-move', `playerToMove ${mover} outside [0, ${players})`)

    // outcome is defined MID-GAME too (rollout cutoff / gen-0 contract)
    const outcome = adapter.outcome(state)
    if (outcome.length !== players) report(seed, step, 'outcome-length', `${outcome.length} values for ${players} players`)
    outcome.forEach((v, p) => {
      if (!Number.isFinite(v) || v < 0 || v > 1) report(seed, step, 'outcome-range', `player ${p} outcome ${v} outside [0, 1]`)
    })

    if (adapter.heuristic !== undefined) {
      const h = adapter.heuristic(state)
      if (h.length !== players) report(seed, step, 'heuristic-length', `${h.length} values for ${players} players`)
      h.forEach((v, p) => {
        if (!Number.isFinite(v)) report(seed, step, 'heuristic-finite', `player ${p} heuristic ${v}`)
      })
    }

    const buf = new Float32Array(adapter.featureSpec.featureLen)
    for (let p = 0; p < players; p++) {
      buf.fill(0)
      adapter.encodeState(state, p, buf)
      for (let i = 0; i < buf.length; i++) {
        if (!Number.isFinite(buf[i]!)) {
          report(seed, step, 'encode-finite', `perspective ${p}: non-finite at feature ${i}`)
          break
        }
      }
    }

    const moves = adapter.legalMoves(state, caps)
    if (moves.length === 0) {
      report(seed, step, 'no-legal-moves', 'non-terminal state enumerated zero moves')
      return
    }
    const keys = moves.map((m) => adapter.moveKey(m))
    const seen = new Set<string>()
    keys.forEach((k) => {
      // Uniqueness is a canonicalization guarantee (project 10) — gated with
      // the other strict-key checks so OeL's pre-canonical enumeration, which
      // can reach one move by several DFS paths, doesn't fail until then.
      if (strict && seen.has(k)) report(seed, step, 'duplicate-key', `two enumerated moves share key '${k}'`)
      seen.add(k)
      if (k.length === 0 || k.split(' ').includes(''))
        report(seed, step, 'key-spacing', `key '${k}' is empty or has leading/trailing/double spaces`)
      if (strict && /[^\S ]/.test(k)) report(seed, step, 'key-token-whitespace', `key '${k}' contains non-space whitespace`)
    })
    if (strict) {
      // schemas.md §2: tokens contain no whitespace, so the number of
      // space-separated fields equals the move's token count. A joined
      // "col row" token inflates the split — the k² duplicate precedent.
      moves.forEach((m, i) => {
        if (Array.isArray(m) && keys[i]!.split(' ').length !== m.length)
          report(seed, step, 'key-token-whitespace', `key '${keys[i]!}' splits to ${keys[i]!.split(' ').length} fields for a ${m.length}-token move`)
      })
    }

    // enumeration is a pure function of (state, caps)
    const again = adapter.legalMoves(state, caps).map((m) => adapter.moveKey(m))
    if (again.join('\n') !== keys.join('\n'))
      report(seed, step, 'enumeration-deterministic', 'two legalMoves calls disagree in content or order')

    // every enumerated move applies
    for (let i = 0; i < moves.length; i++) {
      if (adapter.apply(state, moves[i]!) === undefined) {
        report(seed, step, 'move-applies', `enumerated move '${keys[i]!}' does not apply`)
        break
      }
    }
  }

  // Random-play walk via sampleMove; returns the moveKey trace.
  const walk = (seed: number, withChecks: boolean): string[] => {
    const rng = opts.rng(seed)
    const trace: string[] = []
    let state = adapter.initial(cfg, seed)
    for (let step = 0; step < maxSteps; step++) {
      if (adapter.isTerminal(state)) {
        if (withChecks) checkTerminal(seed, step, state)
        return trace
      }
      if (withChecks && step % stride === 0) checkState(seed, step, state)
      const move = adapter.sampleMove(state, rng)
      if (move === undefined) {
        if (withChecks) report(seed, step, 'sample-move', 'sampleMove undefined on a non-terminal state')
        return trace
      }
      const next = adapter.apply(state, move)
      if (next === undefined) {
        if (withChecks) report(seed, step, 'sample-applies', `sampled move '${adapter.moveKey(move)}' does not apply`)
        return trace
      }
      trace.push(adapter.moveKey(move))
      state = next
    }
    if (withChecks && opts.requireTerminal === true && !adapter.isTerminal(state))
      report(seed, maxSteps, 'terminal-reached', `no terminal state within ${maxSteps} steps`)
    return trace
  }

  const checkTerminal = (seed: number, step: number, state: TState): void => {
    const players = adapter.numPlayers(state)
    const outcome = adapter.outcome(state)
    if (outcome.length !== players) report(seed, step, 'terminal-outcome-length', `${outcome.length} values for ${players} players`)
    outcome.forEach((v, p) => {
      if (!Number.isFinite(v) || v < 0 || v > 1) report(seed, step, 'terminal-outcome-range', `player ${p} outcome ${v} outside [0, 1]`)
    })
  }

  for (const seed of opts.seeds) {
    // initial: constructible, deterministic, not terminal
    let initial: TState
    try {
      initial = adapter.initial(cfg, seed)
    } catch (e) {
      report(seed, -1, 'initial-throws', String(e))
      continue
    }
    if (JSON.stringify(initial) !== JSON.stringify(adapter.initial(cfg, seed)))
      report(seed, -1, 'initial-deterministic', 'two initial() calls produce different states')
    if (adapter.isTerminal(initial)) report(seed, -1, 'initial-terminal', 'initial state is already terminal')

    // seeded determinism: the same seed replays the same game
    const first = walk(seed, true)
    const second = walk(seed, false)
    if (first.join('\n') !== second.join('\n'))
      report(seed, -1, 'walk-deterministic', `same seed diverged: [${first.slice(0, 3).join(', ')}…] vs [${second.slice(0, 3).join(', ')}…]`)
  }

  return out
}
