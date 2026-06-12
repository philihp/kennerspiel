import { replay, asPlaying } from '../engine'
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
  const { instance, entrants, me } = fetched

  const state = replay(instance.commands)
  const playing = asPlaying(state)
  if (playing === undefined) {
    return jsonResult({
      instance_id: instance.id,
      status: state?.status ?? 'UNKNOWN',
      note: 'Game has not started; it has no board state yet. Seats are managed from the website lobby.',
      commands: instance.commands,
      seats: entrants.map((entrant) => ({ color: entrant.color, is_me: entrant.id === me?.id })),
    })
  }

  if (detail === 'full') {
    const { randGen: _randGen, ...fullState } = playing
    return jsonResult({ instance_id: instance.id, my_color: me?.color, state: fullState })
  }
  return jsonResult({ instance_id: instance.id, ...renderSummary(playing, instance.commands, me?.color) })
}
