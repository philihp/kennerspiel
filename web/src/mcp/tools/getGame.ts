import { activePlayerColor, asPlaying, engineColorToEntrantColor, replay } from '../engine'
import { renderSummary } from '../render'
import { errorResult, jsonResult, ToolResult } from '../content'
import { fetchInstance } from './fetchInstance'

export const getGame = async ({
  userId,
  instanceId,
  detail,
}: {
  userId: string
  instanceId: string
  detail: 'summary' | 'full'
}): Promise<ToolResult> => {
  const fetched = await fetchInstance(userId, instanceId)
  if ('error' in fetched) return errorResult(fetched.error)
  const { instance, entrants, mySeats } = fetched

  const myColors = mySeats.map((s) => s.color)
  const mySeatIds = new Set(mySeats.map((s) => s.id))

  const state = replay(instance.commands)
  const playing = asPlaying(state)
  if (playing === undefined) {
    return jsonResult({
      instance_id: instance.id,
      status: state?.status ?? 'UNKNOWN',
      note: 'Game has not started; it has no board state yet. Seats are managed from the website lobby.',
      commands: instance.commands,
      seats: entrants.map((entrant) => ({ color: entrant.color, is_me: mySeatIds.has(entrant.id) })),
    })
  }

  if (detail === 'full') {
    const { randGen: _randGen, ...fullState } = playing
    return jsonResult({ instance_id: instance.id, my_colors: myColors, state: fullState })
  }

  // When the agent controls multiple seats, render from whichever of its seats
  // is currently active (so my_turn reflects the right perspective); fall back
  // to the first seat, or undefined if it controls none.
  const active = engineColorToEntrantColor(activePlayerColor(playing))
  const renderColor = myColors.find((c) => c === active) ?? myColors[0]
  return jsonResult({
    instance_id: instance.id,
    my_colors: myColors,
    ...renderSummary(playing, instance.commands, renderColor),
  })
}
