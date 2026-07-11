import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildCorpus } from '../corpus'
import { runBench } from '../bench'

// Only the deterministic properties are asserted — timing numbers are NOT gated
// in CI (flaky on shared runners); they are read off `pnpm --dir agent bench`
// by hand and pinned in docs/trainer/08-benchmarks.md.
//
// Determinism is decomposed into the two things that are actually reproducible:
//   1. the corpus itself is byte-identical across builds for a fixed seed, and
//   2. runBench's `checksum` (the pure read ops) is identical for a fixed corpus.
// (The bench does NOT assert a stable checksum across two *separate* builds:
// enumerateMoves/sampleMove carry engine-level history dependence, which is why
// they feed `sink` rather than `checksum`.)

describe('bench corpus', () => {
  it('is byte-identical across builds for a fixed seed', async () => {
    const a = await buildCorpus({ size: 25, seed: 7 })
    const b = await buildCorpus({ size: 25, seed: 7 })
    assert.equal(a.totalStates, b.totalStates)
    assert.equal(a.states.length, b.states.length)
    for (let i = 0; i < a.states.length; i++) {
      assert.equal(JSON.stringify(a.states[i]), JSON.stringify(b.states[i]), `state ${i} differs across builds`)
    }
  })

  it('samples a different corpus for a different seed', async () => {
    const a = await buildCorpus({ size: 25, seed: 7 })
    const b = await buildCorpus({ size: 25, seed: 999 })
    assert.equal(a.totalStates, b.totalStates) // same underlying games
    const sig = (c: typeof a) => c.states.map((s) => JSON.stringify(s)).join('')
    assert.notEqual(sig(a), sig(b)) // different sampled subset
  })

  it('collects hundreds of real mid-game states from the default sources', async () => {
    const c = await buildCorpus({ size: 25, seed: 7 })
    assert.ok(c.totalStates > 100, `expected >100 states, got ${c.totalStates}`)
    assert.equal(c.states.length, 25)
    assert.ok(c.sources.includes('fixture:4aedf9e5-3p'))
    assert.ok(c.sources.includes('fixture:21872-4p'))
    assert.ok(c.applyNs.length > c.totalStates) // one apply timing per replayed command
  })
})

describe('bench report', () => {
  it('produces a reproducible checksum for a fixed corpus', async () => {
    const c = await buildCorpus({ size: 25, seed: 7 })
    assert.equal(runBench(c).checksum, runBench(c).checksum)
  })

  it('reports every measured op', async () => {
    const names = runBench(await buildCorpus({ size: 25, seed: 7 })).ops.map((o) => o.name)
    for (const expected of [
      'control(state, [])',
      'completions(state, [])',
      'control(state, []).score',
      'scores(state)',
      'enumerateMoves (capped 24/128)',
      'enumerateMoves (uncapped)',
      'sampleMove',
      'encode',
      'encodeInto (reused scratch)',
    ]) {
      assert.ok(names.includes(expected), `missing op "${expected}" in [${names.join(', ')}]`)
    }
  })

  it('reports branching as counts, reducer-apply as ms, and ordered percentiles', async () => {
    const r = runBench(await buildCorpus({ size: 25, seed: 7 }))
    assert.equal(r.branching.unit, 'count')
    assert.equal(r.reducerApplyMs.unit, 'ms')
    r.ops.forEach((o) => assert.equal(o.unit, 'ms'))
    ;[r.reducerApplyMs, ...r.ops, r.branching].forEach((o) =>
      assert.ok(o.p50 <= o.p90 && o.p90 <= o.p99 && o.p99 <= o.max, `${o.name} percentiles out of order`)
    )
  })
})
