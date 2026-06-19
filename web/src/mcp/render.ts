import { control } from 'hathora-et-labora-game'
import { GameState, RondelToken, Tableau, Tile } from 'hathora-et-labora-game/dist/types'
import { take } from 'hathora-et-labora-game/dist/board/rondel'
import { activePlayerColor, engineColorToEntrantColor } from './engine'

const RONDEL_TOKENS: RondelToken[] = ['wood', 'clay', 'coin', 'joker', 'grain', 'peat', 'sheep', 'grape', 'stone']

const RESOURCE_KEYS = [
  'peat',
  'penny',
  'clay',
  'wood',
  'grain',
  'sheep',
  'stone',
  'flour',
  'grape',
  'nickel',
  'malt',
  'coal',
  'book',
  'ceramic',
  'whiskey',
  'straw',
  'meat',
  'ornament',
  'bread',
  'wine',
  'beer',
  'reliquary',
] as const

const renderTile = (tile: Tile): string => {
  const [land, erection, clergy] = tile
  if (land === undefined) return '--'
  let rendered: string = land
  if (erection !== undefined) rendered += `:${erection}`
  if (clergy !== undefined) rendered += `(${clergy})`
  return rendered
}

// Landscape array indices map to command-space coordinates as
// landscape[row + landscapeOffset][col + 2] (see game/src/board/landscape.ts),
// so each cell is labeled with the "col row" the agent would use in a command.
const renderLandscape = (player: Tableau): string[] =>
  player.landscape.map((tiles, rowIndex) => {
    const row = rowIndex - player.landscapeOffset
    const cells = tiles.map((tile, colIndex) => `[${colIndex - 2}]${renderTile(tile)}`)
    return `row ${row}: ${cells.join(' ')}`
  })

const renderResources = (player: Tableau): Partial<Record<(typeof RESOURCE_KEYS)[number], number>> =>
  RESOURCE_KEYS.reduce(
    (accum, key) => {
      if (player[key] > 0) accum[key] = player[key]
      return accum
    },
    {} as Partial<Record<(typeof RESOURCE_KEYS)[number], number>>
  )

export const renderSummary = (state: GameState, commands: string[], myColor?: string) => {
  const controls = control(state, [])
  const active = engineColorToEntrantColor(activePlayerColor(state))
  return {
    status: state.status,
    config: state.config,
    round: state.frame.round,
    settlement_round: state.frame.settlementRound,
    active_player: active,
    current_player: engineColorToEntrantColor(state.players?.[state.frame.currentPlayerIndex]?.color),
    my_color: myColor,
    my_turn: myColor !== undefined && myColor === active,
    main_action_used: state.frame.mainActionUsed,
    bonus_actions: state.frame.bonusActions,
    rondel: {
      arm: state.rondel.pointingBefore,
      tokens: RONDEL_TOKENS.reduce(
        (accum, token) => {
          const position = state.rondel[token]
          if (position !== undefined)
            accum[token] = { position, value: take(state.rondel.pointingBefore, position, state.config) }
          return accum
        },
        {} as Partial<Record<RondelToken, { position: number; value: number }>>
      ),
    },
    buildings_available: state.buildings,
    wonders_remaining: state.wonders,
    plot_purchase_prices: state.plotPurchasePrices,
    district_purchase_prices: state.districtPurchasePrices,
    players: state.players.slice(0, state.config.players).map((player, i) => ({
      seat: engineColorToEntrantColor(player.color),
      is_active: i === state.frame.activePlayerIndex,
      resources: renderResources(player),
      clergy_at_home: player.clergy,
      settlements_unplaced: player.settlements,
      wonders: player.wonders,
      landscape: renderLandscape(player),
      score: controls.score[i],
    })),
    neutral_player:
      state.config.players === 1 && state.players[1] !== undefined
        ? { landscape: renderLandscape(state.players[1]) }
        : undefined,
    upcoming_turns: controls.flow.slice(0, 8).map((flower) => ({
      round: flower.round,
      player: engineColorToEntrantColor(flower.player),
      settle: flower.settle,
      bonus: flower.bonus,
      introduced: flower.introduced,
    })),
    move_count: commands.length,
    recent_commands: commands.slice(-10),
    landscape_legend:
      'Tiles are LAND[:ERECTION[(CLERGY)]]; land H=hillside P=plains C=coast W=water M=mountain .=below-mountain; -- is an unbought plot. Cell labels [c] give the col to use with row N in commands.',
  }
}
