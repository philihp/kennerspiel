# 03 — Move enumeration & sampling

| | |
| --- | --- |
| Status | ✅ done (`agent/src/moves.ts`) |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md) |

## Goal

Turn the engine's token-by-token legal-move oracle into (a) a curated list of
complete legal moves for search expansion, and (b) a cheap random complete
move for rollouts — the two access patterns everything above this layer needs.

## Design

### The completion tree

The engine builds commands interactively: `control(state, partial).completion`
returns the legal *next tokens* after a partial command, with the empty-string
token `''` marking that `partial` is itself complete and submittable
(`game/src/control.ts` dispatches on the head token to the per-command
`complete*` functions). A full legal move is therefore a root-to-`''`-leaf
path, and legal-move generation is a tree walk. Note each `control()` call
also computes flow and scores that enumeration never reads — the dominant
cost here until [07](07-engine-fast-paths.md)'s `completions()` fast path.

### Exported surface

```ts
export type EnumerateOpts = { maxPerLevel?: number; maxMoves?: number }
export type EnumerateResult = { moves: Move[]; truncated: boolean }

enumerateMovesInfo(state, opts?): EnumerateResult
enumerateMoves(state, opts?): Move[]        // .moves of the above
sampleMove(state, rng, maxDepth = 16): Move | undefined
```

### `enumerateMovesInfo` — capped DFS

Depth-first over the completion tree from `[]`:

1. If `completion` includes `''`, push `partial` onto the output.
2. Recurse into the non-`''` tokens, **truncated to the first `maxPerLevel`**
   (`nexts.slice(0, maxPerLevel)`) — a deterministic prefix in the engine's
   completion order, not a random subset.
3. Stop globally once `out.length >= maxMoves`.
4. `truncated` is set whenever either cap actually bit, so callers can tell a
   complete action set from a curated one.

Both caps default to `Infinity` — **enumeration itself is uncapped**; callers
choose curation. In practice: MCTS expansion uses `{maxPerLevel: 24,
maxMoves: 128}` ([05](05-uct-search.md)), greedy uses `{maxPerLevel: 12,
maxMoves: 64}` ([04](04-baselines-arena.md)), the sampler fallback uses
`{maxPerLevel: 64, maxMoves: 512}`. Caps are load-bearing: branching is
median ~18 but p99 ~1,114 / max ~1,675 complete moves (SETTLE/USE
resource-payment combinatorics), and each visited tree node costs one
`control()` call.

### `sampleMove` — random walk, retry, fallback

Up to 8 attempts, each a random walk from `[]`: draw a uniform token from
`completion` (via `choice(rng, …)`), stop on `''`, give up on an empty
completion or after `maxDepth` (16) tokens. An attempt only counts if the
result actually applies — the engine occasionally offers `''` on a
not-yet-valid partial, so the candidate is verified with `apply()` before
being returned. If all 8 attempts fail, fall back to a capped enumeration
(`{maxPerLevel: 64, maxMoves: 512}`) and pick uniformly from it; return
`undefined` only if even that is empty (a genuinely stuck state). Cost per
call: typically one walk of ≤ a handful of `control()` calls — no
enumeration, which is what makes rollouts affordable.

### Edge cases

Handled: `''` offered on invalid partials (apply-verified), dead-end walks
(retry), pathological branching (caps), states with no legal move
(`undefined`). Not handled: dedup of semantically identical moves that differ
only in token order or joker/plain-token choice — that is
[10](10-move-canonicalization.md); and the walk's per-*token* uniformity means
`sampleMove` is not uniform over complete *moves* (see notes).

## Design notes & tradeoffs

- **DFS over `control()` vs a native full-move generator in the engine.**
  Chosen: drive the same completion oracle the UI uses. Zero new engine
  surface, and legality is by construction identical to what a human could
  submit. Cost: one `control()` call per tree node with flow/score overhead —
  measured as the top search cost, and the motivation for
  [07](07-engine-fast-paths.md)'s `completions()`, a drop-in for the
  `control(...).completion` calls here.
- **Prefix-slice `maxPerLevel` vs a random subset.** Chosen: keep the first
  `maxPerLevel` tokens in engine order. It keeps enumeration a pure function
  of `(state, opts)` — no `Rng` parameter, stable across calls, cacheable, and
  reproducible in tests. Cost: a *systematic* bias toward whatever the engine
  lists first (e.g. low-numbered coordinates and early resource combos);
  tokens past the cap are never even candidates, at every level. A random
  subset would spread the bias but make node expansion nondeterministic
  independent of the search seed. Accepted for v1 because rollouts
  (`sampleMove`) don't go through the caps at all; canonicalization (10)
  shrinks the fat tails at the source, and [14](14-selfplay-v2.md) records
  `truncated` provenance with the candidates.
- **`maxMoves` as a hard global cap.** A last-resort bound so no state can
  produce an unbounded expansion list; combined with `maxPerLevel` it bounds
  work, not just output size (the DFS aborts early once full).
- **`sampleMove` retry + verify + fallback vs trusting the tree.** Chosen:
  verify with `apply()` and retry, then fall back to enumeration. The `''`
  token is occasionally offered on partials the reducer rejects, and a walk
  can dead-end; silently returning an inapplicable move would corrupt
  rollouts. The fallback guarantees a legal move whenever one exists, so
  `undefined` reliably means "stuck/terminal". Cost: an extra `apply()` per
  sample, and the rare worst case pays for a capped enumeration.
- **Per-token uniform sampling vs uniform-over-moves.** Chosen: per-token.
  Uniform over complete moves would require enumerating them — the very cost
  being avoided. The induced distribution over moves is skewed toward shallow
  commands (e.g. `COMMIT` at depth 1 vs a 5-token SETTLE payment), which is
  acceptable — arguably even helpful — for rollout speed; it is *not* a
  calibrated policy prior and is never used as one.
- **`maxDepth = 16`.** Comfortably above the longest real command (multi-token
  USE/SETTLE payments) while bounding a hypothetical runaway completion chain;
  hitting it just burns one retry.

## Inputs

- A `GameState`; `control()` from the engine (later the `completions()` fast
  path from [07](07-engine-fast-paths.md)); an `Rng` (sampling only);
  curation caps.

## Outputs

- `enumerateMovesInfo(state, opts): { moves, truncated }` /
  `enumerateMoves(state, opts): Move[]` — legal complete commands, curated.
- `sampleMove(state, rng, maxDepth?): Move | undefined`.

## How it runs / verification

- Library code — consumed by 04, 05, 10, and the adapter (09).
- `pnpm --dir agent test` — `__tests__/moves.test.ts`: every enumerated move
  at the opening applies cleanly via the reducer; the move-head set is
  non-empty (no dead opening); caps are respected (`maxMoves: 30` honored,
  capped moves still legal, `truncated` reported); `sampleMove` is legal and
  deterministic under a fixed seed (same seed ⇒ same move); and `sampleMove`
  alone drives a long game forward for >50 steps without getting stuck.
