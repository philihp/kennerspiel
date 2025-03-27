import { ErectionEnum, Flower, PlayerColor } from 'hathora-et-labora-game/dist/types'
import { any, equals, length, map } from 'ramda'
import { ReactNode, useState } from 'react'
import { Modal } from './modal'
import { Erection } from './erection'
import Dot from './dot'
import { match } from 'ts-pattern'
import { LucideX } from 'lucide-react'
import { PlayerDot } from './playerDot'

type FrameParams = {
  frame: Flower
}

export const Frame = ({ frame }: FrameParams) => {
  const [modal, setModal] = useState<boolean>(false)

  const handleClose = () => setModal(false)

  return (
    <>
      {frame.settle && (
        <>
          <PlayerDot color={frame.player} />
          Settle
        </>
      )}
      {!frame.settle && frame.bonus && (
        <>
          <PlayerDot color={frame.player} /> Bonus
        </>
      )}
      {!frame.settle && !frame.bonus && (
        <>
          <PlayerDot color={frame.player} />
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
          <Modal closeModal={handleClose} openModal={modal}>
            <form method="dialog" style={{ textAlign: 'right' }}>
              <button type="button" className="primary" onClick={handleClose}>
                <LucideX size={16} />
              </button>
            </form>

            {any((bid) => bid.length === 3, frame.introduced) && (
              <div>These buildings will be made available to be built</div>
            )}
            {map((bid) => {
              if (bid.length === 3) return <Erection key={bid} id={bid as ErectionEnum} />
              if (bid === 'joker') return <div key={bid}>The 🃏 joker token will be added to the rondel at zero</div>
              if (bid === 'stone') return <div key={bid}>The 🪨 stone token will be added to the rondel at zero</div>
              if (bid === 'grape') return <div key={bid}>The 🍇 grape token will be added to the rondel at zero</div>
              return null
            }, frame.introduced)}
          </Modal>
        </span>
      )}
    </>
  )
}
