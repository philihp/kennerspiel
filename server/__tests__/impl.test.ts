import { Impl } from '../impl'

describe('imp', () => {
  it('has at least one test', () => {
    expect.hasAssertions()
    expect(new Impl()).toBeInstanceOf(Impl)
  })
})
