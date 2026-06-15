import { Enums } from '@/supabase.types'
import { createServiceClient } from '@/utils/supabase/service'
import { errorResult, jsonResult, ToolResult } from '../content'

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

const parseInstanceRef = (raw: string): string | undefined => raw.match(UUID_PATTERN)?.[0]

export const joinGame = async ({
  userId,
  instanceRef,
  color,
}: {
  userId: string
  instanceRef: string
  color: Enums<'color'>
}): Promise<ToolResult> => {
  const instanceId = parseInstanceRef(instanceRef)
  if (!instanceId) return errorResult(`Could not parse a game instance id from "${instanceRef}".`)

  const supabase = createServiceClient()

  const { data: instance, error: instanceError } = await supabase
    .from('instance')
    .select('id, commands, entrant(id, profile_id, color)')
    .eq('id', instanceId)
    .single()
  if (instanceError || !instance) return errorResult(`Instance ${instanceId} not found.`)

  // The game lobby (one CONFIG command, then START to begin) accepts new
  // entrants until START is appended. Refuse to mutate seats after that.
  const hasStarted = instance.commands.some((c) => c.startsWith('START '))
  if (hasStarted) return errorResult('Game has already started; seats can no longer change.')

  const conflict = instance.entrant.find((e) => e.color === color && e.profile_id !== userId)
  if (conflict) return errorResult(`Color ${color} is already taken in this game.`)

  // MCP path lets one profile hold multiple seats in the same instance, so we
  // key off (instance_id, color) — the DB unique — rather than upserting on
  // (instance_id, profile_id).
  const existing = instance.entrant.find((e) => e.profile_id === userId && e.color === color)
  if (existing) {
    await supabase.from('entrant').update({ updated_at: new Date().toISOString() }).eq('id', existing.id)
  } else {
    const { error: insertError } = await supabase
      .from('entrant')
      .insert({ instance_id: instanceId, profile_id: userId, color, updated_at: new Date().toISOString() })
    if (insertError) return errorResult(`Failed to claim seat: ${insertError.message}`)
  }

  // Mirror the website lobby: if there's already a CONFIG command, rewrite its
  // player count to match the new seat total so START will accept it.
  const configIdx = instance.commands.findIndex((c) => c.startsWith('CONFIG '))
  if (configIdx >= 0) {
    const { count: seatCount } = await supabase
      .from('entrant')
      .select('id', { count: 'exact', head: true })
      .eq('instance_id', instanceId)
    if (seatCount && seatCount > 0) {
      const oldTokens = instance.commands[configIdx].split(' ')
      const newCommands = [...instance.commands]
      newCommands[configIdx] = ['CONFIG', String(seatCount), oldTokens[2], oldTokens[3]].join(' ')
      await supabase
        .from('instance')
        .update({ commands: newCommands, updated_at: new Date().toISOString() })
        .eq('id', instanceId)
    }
  }

  const { data: seats } = await supabase.from('entrant').select('color, profile_id').eq('instance_id', instanceId)

  return jsonResult({
    ok: true,
    instance_id: instanceId,
    my_color: color,
    my_colors: (seats ?? []).filter((s) => s.profile_id === userId).map((s) => s.color),
    seats: (seats ?? []).map((s) => ({ color: s.color, is_me: s.profile_id === userId })),
    note: 'Seat claimed. Wait for the lobby owner to choose the mode/variant and press START on the website.',
  })
}
