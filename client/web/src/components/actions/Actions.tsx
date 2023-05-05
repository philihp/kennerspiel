import { ChangeEvent, useState } from 'react'
import { equals, filter, reject } from 'ramda'
import classes from './actions.module.css'
import { useHathoraContext } from '../../context/GameContext'
import { ActionUse } from './ActionUse'
import { ActionSettle } from './ActionSettle'
import { ActionBuild } from './ActionBuild'
import { ActionCutPeat } from './ActionCutPeat'
import { ActionFellTrees } from './ActionFellTrees'
import { ActionWorkContract } from './ActionWorkContract'
import { ActionBuyPlot } from './ActionBuyPlot'
import { ActionBuyDistrict } from './ActionBuyDistrict'
import { ActionConvert } from './ActionConvert'

export const Actions = () => {
  // const [suffix, setSuffix] = useState<string>('')
  const { state, control, move, undo, redo } = useHathoraContext()

  const position = state?.control?.partial === '' ? 80 : 50

  // const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   console.log({ msg: 'change' })
  //   const tokens = state?.control?.partial?.split(/\s+/) ?? []
  //   if (tokens.length === 1 && tokens[0] === '') tokens.pop()
  //   tokens.push(e.target.value)
  //   control(tokens.join(' ').trim())
  //   setSuffix('')
  // }

  // const handleBack = () => {
  //   const tokens = state?.control?.partial?.split(/\s+/)
  //   if (tokens === undefined) return
  //   const partial = tokens.slice(0, tokens.length - 1).join(' ')
  //   console.log({ msg: 'trim partial', tokens, partial })
  //   control(partial)
  //   setSuffix('')
  // }

  // const handleSubmit = () => {
  //   console.log({ msg: 'submit' })
  //   const command = state?.control?.partial
  //   if (command) {
  //     setSuffix('')
  //     control('')
  //     move(command)
  //   }
  // }

  return (
    <div className={classes.container} style={{ transform: `translateY(${position}px)` }}>
      <ActionCutPeat />
      <ActionFellTrees />
      <ActionBuild />
      <ActionUse />
      <ActionWorkContract />
      <ActionBuyPlot />
      <ActionBuyDistrict />
      <ActionConvert />
      <ActionSettle />
    </div>
  )
}
