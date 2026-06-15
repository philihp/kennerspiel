import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { createServiceClient } from '@/utils/supabase/service'
import { activePlayerColor, asPlaying, engineColorToEntrantColor, replay } from '../engine'
import { errorResult, jsonResult, ToolResult } from '../content'

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export const waitForMyTurn = async ({
  userId,
  instanceId,
  timeoutSec,
  pollMs = 2000,
}: {
  userId: string
  instanceId: string
  timeoutSec: number
  pollMs?: number
}): Promise<ToolResult> => {
  const supabase = createServiceClient()
  const deadline = Date.now() + timeoutSec * 1000

   
  while (true) {
    const { data, error } = await supabase
      .from('instance')
      .select('id, commands, updated_at, entrant(profile_id, color)')
      .eq('id', instanceId)
      .single()
    if (error || data === null) {
      return errorResult(`Failed to fetch instance ${instanceId}: ${error?.message}`)
    }

    const myColors = data.entrant.filter((e) => e.profile_id === userId).map((e) => e.color)
    if (myColors.length === 0) {
      return errorResult(`You are not seated in instance ${instanceId}`)
    }

    const state = replay(data.commands)
    const playing = asPlaying(state)
    const activeColor = playing && engineColorToEntrantColor(activePlayerColor(playing))
    const status = state?.status ?? 'UNKNOWN'
    const myTurn =
      playing?.status === GameStatusEnum.PLAYING && activeColor !== undefined && myColors.includes(activeColor)
    const gameOver = status !== GameStatusEnum.PLAYING && status !== 'UNKNOWN'

    if (myTurn || gameOver || Date.now() >= deadline) {
      return jsonResult({
        instance_id: data.id,
        my_colors: myColors,
        status,
        active_color: activeColor,
        my_turn: myTurn,
        move_count: data.commands.length,
        updated_at: data.updated_at,
        timed_out: !myTurn && !gameOver,
      })
    }

    const remaining = deadline - Date.now()
    if (remaining <= 0) continue
    await sleep(Math.min(pollMs, remaining))
  }
}
