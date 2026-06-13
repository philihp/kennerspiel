import { control } from 'hathora-et-labora-game'
import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { activePlayerColor, applyCommand, asPlaying, engineColorToEntrantColor, replay } from '../engine'
import { errorResult, jsonResult, ToolResult } from '../content'
import { fetchInstance } from './fetchInstance'

const MAX_COMPLETIONS = 200

export const getLegalMoves = async ({
  userId,
  instanceId,
  partial,
}: {
  userId: string
  instanceId: string
  partial: string[]
}): Promise<ToolResult> => {
  const fetched = await fetchInstance(userId, instanceId)
  if ('error' in fetched) return errorResult(fetched.error)
  const { instance, me } = fetched

  const playing = asPlaying(replay(instance.commands))
  if (playing === undefined) return errorResult('Game has not started yet; there are no moves to make.')
  if (playing.status === GameStatusEnum.FINISHED) {
    return jsonResult({ status: playing.status, completions: [], note: 'Game is finished.' })
  }

  const activeColor = engineColorToEntrantColor(activePlayerColor(playing))
  const completions = control(playing, partial).completion ?? []
  return jsonResult({
    active_color: activeColor,
    my_turn: me !== undefined && me.color === activeColor,
    partial,
    partial_is_complete_command: partial.length > 0 && applyCommand(playing, partial) !== undefined,
    completions: completions.slice(0, MAX_COMPLETIONS),
    ...(completions.length > MAX_COMPLETIONS
      ? { truncated: `${completions.length - MAX_COMPLETIONS} more; refine with a longer partial` }
      : {}),
    note: 'Completions are the legal next tokens after `partial`. Append one and call again to drill down; an empty-string completion (and partial_is_complete_command=true) means the partial can be sent to make_move as-is. Completions are for the active player.',
  })
}
