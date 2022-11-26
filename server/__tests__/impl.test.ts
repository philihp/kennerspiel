import { Impl } from '../impl'

describe('impl', () => {
  it('can instantiate Impl', () => {
    expect.assertions(1)
    expect(new Impl()).toBeInstanceOf(Impl)
  })
})
