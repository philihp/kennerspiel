import { initialState } from '../../../state'
import { BuildingEnum, Frame, GameCommandConfigParams, GameStatePlaying, GameStatusEnum, Tableau } from '../../../types'
import { checkFinalPhase } from '../checkFinalPhase'

describe('board/frame/checkFinalPhase', () => {
  const s0: GameStatePlaying = {
    ...initialState,
    status: GameStatusEnum.PLAYING,
    config: {
      country: 'france',
      players: 2,
      length: 'short',
    },
    rondel: {
      pointingBefore: 0,
    },
    wonders: 0,
    players: [{}, {}, {}] as Tableau[],
    buildings: ['G01'],
    plotPurchasePrices: [],
    districtPurchasePrices: [],
    frame: { next: 3 } as Frame,
  } as GameStatePlaying

  it('retains undefined state', () => {
    const s1 = checkFinalPhase(2)(undefined)!
    expect(s1).toBeUndefined()
  })
  it('2p short keeps frame as it was if not ending', () => {
    const s1 = {
      ...s0,
      config: { country: 'france', players: 2, length: 'short' } as GameCommandConfigParams,
      buildings: ['G01', 'G02', 'F03', 'F04'] as BuildingEnum[],
      frame: { next: 50 } as Frame,
    }
    const s2 = checkFinalPhase(200)(s1)!
    expect(s2.frame.next).toBe(50)
  })
  it('2p long keeps frame as it was if not ending', () => {
    const s1 = {
      ...s0,
      config: { country: 'france', players: 2, length: 'long' } as GameCommandConfigParams,
      buildings: ['G01', 'G02', 'F03', 'F04'] as BuildingEnum[],
      frame: { next: 50 } as Frame,
    }
    const s2 = checkFinalPhase(200)(s1)!
    expect(s2.frame.next).toBe(50)
  })
  it('2p short sets next to be ending', () => {
    const s1 = {
      ...s0,
      config: { country: 'france', players: 2, length: 'short' } as GameCommandConfigParams,
      buildings: ['G01'] as BuildingEnum[],
      frame: { next: 50 } as Frame,
    }
    const s2 = checkFinalPhase(200)(s1)!
    expect(s2.frame.next).toBe(200)
  })
  it('2p long sets next to be ending', () => {
    const s1 = {
      ...s0,
      config: { country: 'france', players: 2, length: 'long' } as GameCommandConfigParams,
      buildings: ['G01', 'G02', 'F03'] as BuildingEnum[],
      frame: { next: 50 } as Frame,
    }
    const s2 = checkFinalPhase(200)(s1)!
    expect(s2.frame.next).toBe(200)
  })
})
