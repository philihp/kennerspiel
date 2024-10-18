'use client'

import { useInstanceContext } from "@/context/InstanceContext"
import { useSupabaseContext } from "@/context/SupabaseContext"

export const GameSetup = () => {
  const { supabase } = useSupabaseContext()
  const { state } = useInstanceContext()

  return <form>
    <pre>{JSON.stringify({ state }, undefined, 2)}</pre>
    <input type="radio" name="country" id="france" value="France" />
    <label htmlFor="france">France</label>
    <input type="radio" name="country" value="Ireland" id="ireland" />
    <label htmlFor="ireland">Ireland</label>
  </form >
}
