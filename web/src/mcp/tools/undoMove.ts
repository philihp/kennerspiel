import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { activePlayerColor, asPlaying, engineColorToEntrantColor, replay } from '../engine'
import { renderSummary } from '../render'
import { errorResult, jsonResult, ToolResult } from '../content'
import { fetchInstance } from './fetchInstance'

export const undoMove = async ({ userId, instanceId }: { userId: string; instanceId: string }): Promise<ToolResult> => {
  const fetched = await fetchInstance(userId, instanceId)
  if ('error' in fetched) return errorResult(fetched.error)
  const { supabase, instance, mySeats } = fetched

  // 1. seat check
  if (mySeats.length === 0) return errorResult('You are not seated in this game.')

  // 2. floor check — the first two commands are CONFIG and START
  if (instance.commands.length <= 2) {
    return errorResult('Nothing to undo: the game has not had any moves played yet.')
  }

  // 3. ownership check — replay everything except the last command and read
  // whose turn it was; only that player could have appended it
  const priorState = asPlaying(replay(instance.commands.slice(0, -1)))
  if (priorState === undefined) {
    return errorResult('Cannot undo: prior state could not be replayed.')
  }
  if (priorState.status === GameStatusEnum.FINISHED) {
    return errorResult('Cannot undo: prior state is already FINISHED.')
  }
  const lastMoveColor = engineColorToEntrantColor(activePlayerColor(priorState))
  const lastMoveSeat = mySeats.find((s) => s.color === lastMoveColor)
  if (!lastMoveSeat) {
    const mine = mySeats.map((s) => s.color).join(', ')
    return errorResult(
      `Cannot undo: the last move was made by ${lastMoveColor}, and you are ${mine}. You can only undo your own moves.`
    )
  }

  // 4. atomic pop — only if no one else has moved or undone since we replayed
  const { data, error } = await supabase.rpc('pop_command', {
    p_instance_id: instance.id,
    p_expected_count: instance.commands.length,
  })
  if (error) return errorResult(`Failed to undo move: ${error.message}`)
  if (!data || data.length === 0) {
    return errorResult('Conflict: the game changed while you were deciding. Re-read it with get_game and try again.')
  }

  const [updated] = data
  const updatedState = asPlaying(replay(updated.commands))
  if (updatedState === undefined) return errorResult('Undo was applied, but the resulting state could not be replayed.')
  return jsonResult({
    ok: true,
    undone: instance.commands[instance.commands.length - 1],
    state: renderSummary(updatedState, updated.commands, lastMoveSeat.color),
  })
}
