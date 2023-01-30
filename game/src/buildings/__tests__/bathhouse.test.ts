import { initialState } from '../../reducer'
import {
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { bathhouse } from '../bathhouse'

describe('buildings/bathhouse', () => {
  describe('bathhouse', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: ['LB2B'] as Clergy[],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1', 'PRIB'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2', 'LB1B'], ['P'], ['P', 'LB3'], [], []],
      ] as Tile[][],
      landscapeOffset: 0,
      peat: 0,
      penny: 1,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 0,
      book: 0,
      pottery: 0,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 0,
    }
    const s0: GameStatePlaying = {
      ...initialState,
      status: GameStatusEnum.PLAYING,
      activePlayerIndex: 0,
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 3,
        grape: 1,
        joker: 2,
      },
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      settling: false,
      extraRound: false,
      moveInRound: 1,
      round: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      buildings: [],
      nextUse: NextUseClergy.Any,
      canBuyLandscape: true,
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      neutralBuildingPhase: false,
    }

    it('follows happy path', () => {
      const s1 = bathhouse()(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 0,
        book: 1,
        pottery: 1,
      })
      expect(s1.players[0].clergy).toContain('PRIB')
      expect(s1.players[0].clergy).toContain('LB1B')
      expect(s1.players[0].clergy).toContain('LB2B')
      expect(s1.players[0].landscape).toStrictEqual([
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
    })

    it('will not move someone elses piece', () => {
      // how could this happen? i dunno, but why not just make sure it doesnt?
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P'], ['P', 'LFO', 'LB1R'], ['P', 'LFO'], ['P'], ['P', 'LB1', 'PRIB'], [], []],
              [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2', 'LB1B'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bathhouse()(s1)! as GameStatePlaying
      expect(s2.players[0].clergy).toContain('PRIB')
      expect(s2.players[0].clergy).toContain('LB1B')
      expect(s2.players[0].clergy).toContain('LB2B')
      expect(s2.players[0].landscape).toStrictEqual([
        [[], [], ['P'], ['P', 'LFO', 'LB1R'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
    })

    it('fails if no pennies', () => {
      const s1 = { ...s0, players: [{ ...s0.players[0], penny: 0 }, ...s0.players.slice(1)] }
      const s2 = bathhouse()(s1)! as GameStatePlaying
      expect(s2).toBeUndefined()
    })
  })
})
