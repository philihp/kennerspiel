import { Flower, PlayerColor } from 'hathora-et-labora-game/dist/types'
import { any, equals, length, map } from 'ramda'
import { ReactNode, useState } from 'react'
import { FrameModal } from './frameModal'
import { Erection } from './erection'
import Dot from './dot'
import { match } from 'ts-pattern'

const colorToChar = (color?: PlayerColor): ReactNode =>
  match(color)
    .with(PlayerColor.Red, (c) => <Dot color={'#fb8072'} border={'#ad574d'} />)
    .with(PlayerColor.Green, (c) => <Dot color={'#b3de69'} border={'#87a74f'} />)
    .with(PlayerColor.Blue, (c) => <Dot color={'#80b1d3'} border={'#5f849e'} />)
    .with(PlayerColor.White, (c) => <Dot color={'#d9d9d9'} border={'#b1b1b1'} />)
    .otherwise(() => <></>)

type FrameParams = {
  frame: Flower
}

export const Frame = ({ frame }: FrameParams) => {
  const [modal, setModal] = useState<boolean>(false)

  return (
    <>
      {frame.settle && (
        <>
          {colorToChar(frame.player)}
          Settle
        </>
      )}
      {!frame.settle && frame.bonus && <>{colorToChar(frame.player)} Bonus</>}
      {!frame.settle && !frame.bonus && (
        <>
          {colorToChar(frame.player)}
          Action, round {frame.round}
        </>
      )}
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
