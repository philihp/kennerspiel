import { Flower } from 'hathora-et-labora-game/dist/types'
import { any, equals, length, map } from 'ramda'
import { useState } from 'react'
import { FrameModal } from './frameModal'
import { Erection } from './erection'

const colorToChar = (color?: string): string => {
  return color ?? ''
}

type FrameParams = {
  frame: Flower
}

export const Frame = ({ frame }: FrameParams) => {
  const [modal, setModal] = useState<boolean>(false)

  return (
    <>
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
              if (bid === 'joker') return <div key={bid}>The 🃏 joker token will be added to the rondel at zero</div>
              if (bid === 'stone') return <div key={bid}>The 🪨 stone token will be added to the rondel at zero</div>
              if (bid === 'grape') return <div key={bid}>The 🍇 grape token will be added to the rondel at zero</div>
              return null
            }, frame.introduced)}
          </FrameModal>
        </span>
      )}
    </>
  )
}
