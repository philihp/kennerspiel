import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { Enums } from '@/supabase.types'
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

  // One profile can hold several seats in the same instance (MCP only), so
  // group by instance and union the colors.
  const byInstance = new Map<
    string,
    { commands: string[]; updated_at: string; colors: Enums<'color'>[] }
  >()
  for (const row of data ?? []) {
    if (row.instance === null) continue
    const existing = byInstance.get(row.instance.id)
    if (existing) {
      existing.colors.push(row.color)
    } else {
      byInstance.set(row.instance.id, {
        commands: row.instance.commands,
        updated_at: row.instance.updated_at,
        colors: [row.color],
      })
    }
  }

  const games = Array.from(byInstance.entries())
    .map(([instanceId, { commands, updated_at, colors }]) => {
      const state = replay(commands)
      const playing = asPlaying(state)
      const activeColor = playing && engineColorToEntrantColor(activePlayerColor(playing))
      return {
        instance_id: instanceId,
        my_colors: colors,
        status: state?.status ?? 'UNKNOWN',
        active_color: activeColor,
        my_turn:
          playing?.status === GameStatusEnum.PLAYING &&
          activeColor !== undefined &&
          colors.includes(activeColor),
        move_count: commands.length,
        updated_at,
      }
    })
    .filter((game) => !onlyMyTurn || game.my_turn)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))

  return jsonResult(games)
}
