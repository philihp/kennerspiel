import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { activePlayerColor, applyCommand, asPlaying, engineColorToEntrantColor, replay, tokenize } from '../engine'
import { renderSummary } from '../render'
import { errorResult, jsonResult, ToolResult } from '../content'
import { fetchInstance } from './fetchInstance'

export const makeMove = async ({
  userId,
  instanceId,
  command,
}: {
  userId: string
  instanceId: string
  command: string
}): Promise<ToolResult> => {
  const fetched = await fetchInstance(userId, instanceId)
  if ('error' in fetched) return errorResult(fetched.error)
  const { supabase, instance, me } = fetched

  // 1. seat check
  if (me === undefined) return errorResult('You are not seated in this game.')

  // 2. status check
  const playing = asPlaying(replay(instance.commands))
  if (playing === undefined)
    return errorResult('Game has not started yet; seats and setup are managed from the website lobby.')
  if (playing.status === GameStatusEnum.FINISHED) return errorResult('Game is already finished.')

  // 3. turn check
  const activeColor = engineColorToEntrantColor(activePlayerColor(playing))
  if (activeColor !== me.color) {
    return errorResult(`It is not your turn: you are ${me.color}, and ${activeColor} is the active player.`)
  }

  // 4. legality check
  const tokens = tokenize(command)
  const nextState = applyCommand(playing, tokens)
  if (nextState === undefined) {
    return errorResult(
      `Illegal move: "${tokens.join(' ')}" was rejected by the game engine. Use get_legal_moves to find a legal command.`
    )
  }

  // 5. atomic append — only if no one else has moved since we replayed
  const { data, error } = await supabase.rpc('append_command', {
    p_instance_id: instance.id,
    p_expected_count: instance.commands.length,
    p_command: tokens.join(' '),
  })
  if (error) return errorResult(`Failed to append move: ${error.message}`)
  if (!data || data.length === 0) {
    return errorResult('Conflict: the game changed while you were deciding. Re-read it with get_game and try again.')
  }

  const [updated] = data
  const updatedState = asPlaying(replay(updated.commands))
  if (updatedState === undefined) return errorResult('Move was saved, but the resulting state could not be replayed.')
  return jsonResult({
    ok: true,
    played: tokens.join(' '),
    state: renderSummary(updatedState, updated.commands, me.color),
  })
}
