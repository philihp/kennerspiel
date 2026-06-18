import { RealtimeChannel, REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'
import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { Enums } from '@/supabase.types'
import { createServiceClient } from '@/utils/supabase/service'
import { activePlayerColor, asPlaying, engineColorToEntrantColor, replay } from '../engine'
import { errorResult, jsonResult, ToolResult } from '../content'

// The frontend listens to one `instance:<id>` broadcast channel per game
// (see src/context/InstanceContext.ts). The Postgres trigger
// instance_broadcast_trigger fires on every INSERT/UPDATE/DELETE on the
// instance table and pushes a `sync` broadcast with the full row.
//
// subscribe_events generalizes that: open one channel per instance the
// agent's user is seated in (filter to filterInstanceIds if provided),
// accumulate events into a buffer, and return when minEvents is reached or
// timeoutSec elapses. Use this instead of polling get_game/list_my_games
// while waiting on opponents — the wakeup is push-driven, single-digit ms
// latency.
type InstanceEvent = {
  instance_id: string
  status: string
  active_color: Enums<'color'> | undefined
  move_count: number
  my_colors: Enums<'color'>[]
  my_turn: boolean
  latest_command: string | undefined
  ts: string
}

const computeEvent = (
  instanceId: string,
  commands: string[],
  myColors: Enums<'color'>[]
): Omit<InstanceEvent, 'ts'> => {
  const state = replay(commands)
  const playing = asPlaying(state)
  const activeColor = playing && engineColorToEntrantColor(activePlayerColor(playing))
  return {
    instance_id: instanceId,
    status: state?.status ?? 'UNKNOWN',
    active_color: activeColor,
    move_count: commands.length,
    my_colors: myColors,
    my_turn: playing?.status === GameStatusEnum.PLAYING && activeColor !== undefined && myColors.includes(activeColor),
    latest_command: commands[commands.length - 1],
  }
}

export const subscribeEvents = async ({
  userId,
  filterInstanceIds,
  filterMyTurn,
  timeoutSec,
  minEvents,
  maxEvents,
}: {
  userId: string
  filterInstanceIds?: string[]
  filterMyTurn: boolean
  timeoutSec: number
  minEvents: number
  maxEvents: number
}): Promise<ToolResult> => {
  const supabase = createServiceClient()

  const { data: seats, error: seatsError } = await supabase
    .from('entrant')
    .select('color, instance_id, instance(id, commands)')
    .eq('profile_id', userId)
  if (seatsError) return errorResult(`Failed to load seats: ${seatsError.message}`)

  const requested = filterInstanceIds && new Set(filterInstanceIds)
  const myInstances = new Map<string, { colors: Enums<'color'>[]; commands: string[] }>()
  for (const seat of seats ?? []) {
    if (!seat.instance || !seat.instance_id) continue
    const id = seat.instance_id
    if (requested && !requested.has(id)) continue
    const existing = myInstances.get(id)
    if (existing) existing.colors.push(seat.color)
    else myInstances.set(id, { colors: [seat.color], commands: seat.instance.commands })
  }

  if (requested) {
    const missing = [...requested].filter((id) => !myInstances.has(id))
    if (missing.length > 0)
      return errorResult(`You are not seated in: ${missing.join(', ')}. Drop them from filter_instance_ids.`)
  }

  const watched = [...myInstances.keys()]
  if (watched.length === 0) {
    return jsonResult({
      events: [],
      timed_out: true,
      watched_instance_ids: [],
      note: 'No matching games to watch. Join a lobby or pass filter_instance_ids matching your seats.',
    })
  }

  const events: InstanceEvent[] = []
  const channels: RealtimeChannel[] = []

  await new Promise<void>((resolve) => {
    let resolved = false
    const finish = () => {
      if (resolved) return
      resolved = true
      clearTimeout(deadline)
      resolve()
    }
    const deadline = setTimeout(finish, timeoutSec * 1000)

    for (const [instanceId, { colors }] of myInstances) {
      const channel = supabase.channel(`instance:${instanceId}`)
      channel.on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'sync' }, ({ payload }) => {
        const commands = (payload as { commands?: string[] }).commands ?? []
        const computed = computeEvent(instanceId, commands, colors)
        if (filterMyTurn && !computed.my_turn) return
        events.push({ ...computed, ts: new Date().toISOString() })
        if (events.length >= maxEvents || events.length >= minEvents) finish()
      })
      channel.subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
        if (err) {
          // One channel failing to subscribe is not fatal — the rest can still
          // deliver. Surface it via the note field below if no events arrive.
          console.error('subscribe_events: channel error', instanceId, err)
        }
      })
      channels.push(channel)
    }
  })

  await Promise.all(
    channels.map(async (ch) => {
      try {
        await ch.unsubscribe()
        supabase.removeChannel(ch)
      } catch {
        // best-effort cleanup
      }
    })
  )

  return jsonResult({
    events,
    timed_out: events.length < minEvents,
    watched_instance_ids: watched,
    ...(filterMyTurn ? { filter_my_turn: true } : {}),
  })
}
