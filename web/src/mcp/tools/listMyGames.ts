import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { createServiceClient } from '@/utils/supabase/service'
import { activePlayerColor, asPlaying, engineColorToEntrantColor, replay } from '../engine'
import { errorResult, jsonResult, ToolResult } from '../content'

export const listMyGames = async ({
  userId,
  onlyMyTurn,
}: {
  userId: string
  onlyMyTurn: boolean
}): Promise<ToolResult> => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('entrant')
    .select('color, instance(id, commands, updated_at)')
    .eq('profile_id', userId)
  if (error) return errorResult(`Failed to list games: ${error.message}`)

  const games = (data ?? [])
    .flatMap(({ color, instance }) => {
      if (instance === null) return []
      const state = replay(instance.commands)
      const playing = asPlaying(state)
      const activeColor = playing && engineColorToEntrantColor(activePlayerColor(playing))
      return [
        {
          instance_id: instance.id,
          my_color: color,
          status: state?.status ?? 'UNKNOWN',
          active_color: activeColor,
          my_turn: playing?.status === GameStatusEnum.PLAYING && activeColor === color,
          move_count: instance.commands.length,
          updated_at: instance.updated_at,
        },
      ]
    })
    .filter((game) => !onlyMyTurn || game.my_turn)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))

  return jsonResult(games)
}
