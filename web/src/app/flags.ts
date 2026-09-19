import { flag } from 'flags/next'

export const irelandFlag = flag({
  key: 'ireland',
  description: 'Enable Ireland Variant',
  decide() {
    return false
  },
})

export const isometricFlag = flag({
  key: 'isometric',
  description: 'Show landscapes in isometric projection',
  decide() {
    return false
  },
})
