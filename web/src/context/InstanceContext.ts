'use client'

import { control, GameState, GameStatePlaying, initialState, reducer } from 'hathora-et-labora-game'
import {
  createContext,
  createElement,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES, User } from '@supabase/supabase-js'
import { Enums, Tables } from '@/supabase.types'
import { Controls, GameStatusEnum, PlayerColor, Tableau } from 'hathora-et-labora-game/dist/types'
import { match } from 'ts-pattern'
import { serverMove } from './actions'
import { useSupabaseContext } from './SupabaseContext'

const engineColorToEntrantColor = (c?: PlayerColor): Enums<'color'> | undefined =>
  match<PlayerColor | undefined, Enums<'color'> | undefined>(c)
    .with(PlayerColor.Red, () => 'red')
    .with(PlayerColor.Green, () => 'green')
    .with(PlayerColor.Blue, () => 'blue')
    .with(PlayerColor.White, () => 'white')
    .with(undefined, () => undefined)
    .exhaustive()

type InstanceContextType = {
  instance: Tables<'instance'>
  entrants: Tables<'entrant'>[]
  flags: Record<string, any>
  user?: User
  rawState?: GameState
  state?: GameStatePlaying
  currentPlayer?: Tableau
  partial: string[]
  controls?: Controls
  commands: string[]
  active: boolean
  setInstance: Dispatch<SetStateAction<Tables<'instance'>>>
  setEntrants: Dispatch<SetStateAction<Tables<'entrant'>[]>>
  addPartial: (command: string) => void
  setPartial: (commands: string[]) => void
  move: () => Promise<void>
  undo?: () => void
  redo?: () => void
}

type InstanceContextProviderProps = {
  user: User | null
  instance: Tables<'instance'>
  entrants: Tables<'entrant'>[]
  flags: Record<string, any>
  children: ReactNode | ReactNode[]
}

const InstanceContext = createContext<InstanceContextType>(
  {} as InstanceContextType
  // the "as InstanceContextType" here means it is possible instance might have an unchecked undefined
  // however since the InstanceContextProviderProps will always be setting this, it should be fine
)

export const InstanceContextProvider = ({
  children,
  user,
  instance: providedInstance,
  entrants: providedEntrants,
  flags,
}: InstanceContextProviderProps) => {
  const { supabase } = useSupabaseContext()
  const [instance, setInstance] = useState<Tables<'instance'>>(providedInstance)
  const [entrants, setEntrants] = useState<Tables<'entrant'>[]>(providedEntrants)
  const [partial, setPartial] = useState<string[]>([])
  const [commands, setCommands] = useState<string[]>(providedInstance.commands)
  const [debounced, setDebounced] = useState(false)

  useEffect(() => {
    setCommands(instance.commands)
  }, [instance.commands, setCommands])

  useEffect(() => {
    if (supabase === undefined) return
    const channel = supabase?.channel(`instance:${instance?.id}`)
    channel.on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'sync' }, ({ payload }) => {
      const { id, ...payloadWIthoutId } = payload
      setInstance((oldPayload) => ({ ...oldPayload, ...payloadWIthoutId }))
    })
    channel.subscribe(async (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
      if (err) {
        console.error({ err })
        return
      }
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
      }
    })

    return () => {
      channel?.unsubscribe()
      channel && supabase?.removeChannel(channel)
    }
  }, [supabase, user?.id, instance?.id])

  const gameState = useMemo(() => {
    return [...commands]
      .map((s) => s.split(' '))
      .reduce<
        GameState | undefined
      >(reducer as (state: GameState | undefined, [command, ...params]: string[]) => GameState | undefined, initialState)
  }, [commands])

  const controls = useMemo(() => {
    if (gameState?.status === GameStatusEnum.SETUP) return undefined
    return control(gameState as GameStatePlaying, partial)
  }, [gameState, partial])

  const addPartial = (command: string) => {
    setPartial([...partial, ...command.split(' ').filter((s) => s)])
  }

  const move = async () => {
    setDebounced(true)
    const { error, commands: newCommands } = await serverMove(instance.id, [...commands, partial.join(' ')])
    if (error) return console.error(error)
    setCommands(newCommands ?? commands)
    setPartial([])
    setDebounced(false)
  }

  const undo =
    commands.length <= 2
      ? undefined
      : () => {
          setCommands(instance.commands.slice(0, Math.max(2, commands.length - 1)))
          setPartial([])
        }

  const redo =
    commands.length === instance.commands.length
      ? undefined
      : () => {
          setCommands(instance.commands.slice(0, commands.length + 1))
          setPartial([])
        }

  const activeColor = gameState?.players?.[(gameState as GameStatePlaying)?.frame?.activePlayerIndex]?.color
  const entrant = entrants.find((e) => e.color === engineColorToEntrantColor(activeColor))
  const active = !!user && entrant?.profile_id === user?.id && !debounced

  return createElement(
    InstanceContext.Provider,
    {
      value: {
        user: user === null ? undefined : user,
        instance,
        entrants,
        rawState: gameState,
        state: gameState as GameStatePlaying,
        partial,
        controls,
        commands,
        active,
        flags,
        currentPlayer: gameState?.players?.[(gameState as GameStatePlaying)?.frame?.currentPlayerIndex],
        setInstance,
        setEntrants,
        addPartial,
        setPartial,
        move,
        undo,
        redo,
      },
    },
    children
  )
}

export const useInstanceContext = () => useContext(InstanceContext)
