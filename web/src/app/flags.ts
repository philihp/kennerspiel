import { flag } from 'flags/next'

export const irelandFlag = flag({
  key: 'ireland',
  description: 'Enable Ireland Variant',
  decide() {
    return false
  },
})
