import { describe, it, test, beforeEach, afterEach, before, after, mock } from 'node:test'
import assert from 'node:assert/strict'

export { describe, it, test, beforeEach, afterEach, before, after, mock }

const deepEquals = (a: unknown, b: unknown): boolean => {
  try {
    assert.deepStrictEqual(a, b)
    return true
  } catch {
    return false
  }
}

const partiallyMatches = (actual: unknown, expected: unknown): boolean => {
  try {
    assert.partialDeepStrictEqual(actual, expected)
    return true
  } catch {
    return false
  }
}

type Matchers = {
  toBe(expected: unknown): void
  toStrictEqual(expected: unknown): void
  toMatchObject(expected: unknown): void
  toContain(expected: unknown): void
  toBeUndefined(): void
  toBeDefined(): void
  toBeTruthy(): void
  toBeFalsy(): void
  toHaveLength(n: number): void
  toThrow(expected?: unknown): void
  toBeInstanceOf(C: abstract new (...args: never[]) => unknown): void
  toBeCloseTo(n: number, d?: number): void
  toBeLessThan(n: number): void
  toBeGreaterThanOrEqual(n: number): void
  toHaveBeenCalled(): void
  toHaveBeenCalledWith(...args: unknown[]): void
  not: Matchers
}

export const expect = (actual: unknown): Matchers => {
  const make = (negated: boolean): Matchers => ({
    toBe(expected) {
      negated ? assert.notStrictEqual(actual, expected) : assert.strictEqual(actual, expected)
    },
    toStrictEqual(expected) {
      negated ? assert.notDeepStrictEqual(actual, expected) : assert.deepStrictEqual(actual, expected)
    },
    toMatchObject(expected) {
      negated
        ? assert.ok(!partiallyMatches(actual, expected), `Expected value NOT to match object`)
        : assert.partialDeepStrictEqual(actual, expected)
    },
    toContain(expected) {
      let contains: boolean
      if (typeof actual === 'string') {
        contains = actual.includes(expected as string)
      } else if (Array.isArray(actual)) {
        contains = actual.includes(expected)
      } else {
        contains = [...(actual as Iterable<unknown>)].includes(expected)
      }
      negated
        ? assert.ok(!contains, `Expected value NOT to contain ${JSON.stringify(expected)}`)
        : assert.ok(contains, `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`)
    },
    toBeUndefined() {
      negated ? assert.notStrictEqual(actual, undefined) : assert.strictEqual(actual, undefined)
    },
    toBeDefined() {
      negated ? assert.strictEqual(actual, undefined) : assert.notStrictEqual(actual, undefined)
    },
    toBeTruthy() {
      negated ? assert.ok(!actual) : assert.ok(actual)
    },
    toBeFalsy() {
      negated ? assert.ok(actual) : assert.ok(!actual)
    },
    toHaveLength(n) {
      const len = (actual as { length: number }).length
      negated ? assert.notStrictEqual(len, n) : assert.strictEqual(len, n)
    },
    toThrow(expected) {
      if (negated) {
        assert.doesNotThrow(actual as () => void)
      } else if (typeof expected === 'string') {
        assert.throws(actual as () => void, { message: expected })
      } else if (expected !== undefined) {
        assert.throws(actual as () => void, expected as Error)
      } else {
        assert.throws(actual as () => void)
      }
    },
    toBeInstanceOf(C) {
      negated
        ? assert.ok(!(actual instanceof C), `Expected value NOT to be instance of ${C.name}`)
        : assert.ok(actual instanceof C, `Expected value to be instance of ${C.name}`)
    },
    toBeCloseTo(n, d = 2) {
      const delta = Math.pow(10, -d) / 2
      const diff = Math.abs((actual as number) - n)
      negated
        ? assert.ok(diff >= delta, `Expected ${String(actual)} NOT to be close to ${n}`)
        : assert.ok(diff < delta, `Expected ${String(actual)} to be close to ${n} (±${delta})`)
    },
    toBeLessThan(n) {
      negated
        ? assert.ok((actual as number) >= n, `Expected ${String(actual)} NOT to be less than ${n}`)
        : assert.ok((actual as number) < n, `Expected ${String(actual)} to be less than ${n}`)
    },
    toBeGreaterThanOrEqual(n) {
      negated
        ? assert.ok((actual as number) < n, `Expected ${String(actual)} NOT to be >= ${n}`)
        : assert.ok((actual as number) >= n, `Expected ${String(actual)} to be >= ${n}`)
    },
    toHaveBeenCalled() {
      const calls = (actual as { mock: { calls: unknown[] } }).mock.calls.length
      negated
        ? assert.strictEqual(calls, 0, `Expected mock NOT to have been called`)
        : assert.ok(calls > 0, `Expected mock to have been called`)
    },
    toHaveBeenCalledWith(...args) {
      const mockCalls = (actual as { mock: { calls: { arguments: unknown[] }[] } }).mock.calls
      const found = mockCalls.some((call) => deepEquals(call.arguments, args))
      negated
        ? assert.ok(!found, `Expected mock NOT to have been called with ${JSON.stringify(args)}`)
        : assert.ok(
            found,
            `Expected mock to have been called with ${JSON.stringify(args)}, got: ${JSON.stringify(mockCalls.map((c) => c.arguments))}`
          )
    },
    get not() {
      return make(!negated)
    },
  })
  return make(false)
}

// no-op: node:test has no equivalent for asserting a specific number of assertions
expect.assertions = (_n: number) => {}
expect.hasAssertions = () => {}
