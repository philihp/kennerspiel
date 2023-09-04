import { useState } from 'react'
import { any, equals, includes, length, map } from 'ramda'
import { EngineColor, EngineFlower } from '../../../../api/types'
import { FrameModal } from './FrameModal'
import { Erection } from './Erection'

const colorToChar = (color?: EngineColor): string => {
  switch (color) {
    case EngineColor.Red:
      return 'R'
    case EngineColor.Blue:
      return 'B'
    case EngineColor.Green:
      return 'G'
    case EngineColor.White:
      return 'W'
    default:
      return ''
  }
}

type Params = {
  frame: EngineFlower
}

export const Frame = ({ frame }: Params) => {
  const [modal, setModal] = useState<boolean>(false)

  return (
    <li>
      {frame.settle && `Settle ${colorToChar(frame.player)}`}
      {!frame.settle && frame.bonus && `Bonus ${colorToChar(frame.player)}`}
      {!frame.settle && !frame.bonus && `Round ${frame.round} ${colorToChar(frame.player)}`}
      {frame.introduced.length > 0 && (
        <span>
          {' '}
          <a
            href=""
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              border: '1px solid #ccc',
              padding: 3,
              borderRadius: 4,
            }}
            onClick={(e) => {
              e.preventDefault()
              setModal(true)
            }}
          >
            {any(equals('grape'), frame.introduced) && '🍇'}
            {any(equals('stone'), frame.introduced) && '🪨'}
            {any(equals('joker'), frame.introduced) && '🃏'}
            {any(equals(3), map(length, frame.introduced)) && '🏘️'}
          </a>
          <FrameModal closeModal={() => setModal(false)} openModal={modal}>
            {any((bid) => bid.length === 3, frame.introduced) && (
              <div>These buildings will be made available to be built</div>
            )}
            {map((bid) => {
              if (bid.length === 3) return <Erection key={bid} id={bid} />
              if (bid === 'joker') return <div>The 🃏 joker token will be added to the rondel at zero</div>
              if (bid === 'stone') return <div>The 🪨 stone token will be added to the rondel at zero</div>
              if (bid === 'grape') return <div>The 🍇 grape token will be added to the rondel at zero</div>
              return null
            }, frame.introduced)}
          </FrameModal>
        </span>
      )}
    </li>
  )
}
