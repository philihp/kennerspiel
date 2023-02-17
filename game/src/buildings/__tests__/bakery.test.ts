import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { initialState } from '../../state'
import { bakery } from '../bakery'

describe('buildings/bakery', () => {
  describe('bakery', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 0,
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
      frame: {
        next: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        currentPlayerIndex: 0,
        activePlayerIndex: 0,
        neutralBuildingPhase: false,
        bonusRoundPlacement: false,
        mainActionUsed: false,
        bonusActions: [],
        canBuyLandscape: true,
        unusableBuildings: [],
        usableBuildings: [],
        nextUse: NextUseClergy.Any,
      },
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = bakery()(s0)
      expect(s1).toBeUndefined()
    })
    it('fails if you give it more flour than energy', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('WoFlFlFl')(s1)!
      expect(s2).toBeUndefined()
    })
    it('bakes bread using wood, then converts to coins', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('WoFlFlBrBr')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        flour: 8,
        wood: 9,
        bread: 10,
        penny: 3,
        nickel: 1,
      })
    })
    it('bakes bread using wood with partial coin conversion', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('WoFlFlBrBr')(s1)!
      const s3 = bakery('WoFlFlBr')(s2)!
      expect(s3.players[0]).toMatchObject({
        flour: 6,
        wood: 8,
        bread: 11,
        nickel: 1,
        penny: 7,
      })
    })
    it('bakes bread using wood with no coin conversion', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('WoFlFlBrBr')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        flour: 8,
        wood: 9,
        bread: 10,
        penny: 3,
        nickel: 1,
      })
      const s3 = bakery('WoFlFl')(s2)!
      expect(s3.players[0]).toMatchObject({
        flour: 6,
        wood: 8,
        bread: 12,
        nickel: 1,
        penny: 3,
      })
    })
    it('baking bread with wood, rounds down on half usage', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('WoFlFlBrBr')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        flour: 8,
        wood: 9,
        bread: 10,
        penny: 3,
        nickel: 1,
      })
      const s3 = bakery('WoFl')(s2)!
      expect(s3.players[0]).toMatchObject({
        bread: 11,
        flour: 7,
        nickel: 1,
        penny: 3,
        wood: 8,
      })
    })
    it('allows using just to sell bread without baking', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('BrBr')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        flour: 10,
        wood: 10,
        bread: 8,
        nickel: 1,
        penny: 3,
      })
    })
    it('can bake one bread, but sell two if already had one', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('WoFlBrBr')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        flour: 9,
        wood: 9,
        bread: 9,
        nickel: 1,
        penny: 3,
      })
    })
    it('does not allow selling bread you dont have and arent making', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            flour: 10,
            wood: 10,
            bread: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bakery('BrBr')(s1)!
      expect(s2).toBeUndefined()
    })
  })
})
