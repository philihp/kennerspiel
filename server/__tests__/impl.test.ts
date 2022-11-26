import { Impl } from '../impl'

describe('imp', () => {
  it('has at least one test', () => {
    expect.assertions(1)
    expect(new Impl()).toBeInstanceOf(Impl)
  })
})
