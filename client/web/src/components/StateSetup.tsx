import { Color, Country, EngineConfig, Length, User } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const occupied = (color: Color, users?: User[]) => users && !!users.find((user) => user.color === color)

const configured = (country: Country, length: Length, config?: EngineConfig) =>
  config && config.country === country && config.length === length

export const StateSetup = () => {
  const { state, join, config, start } = useHathoraContext()
  const users = state?.users
  const engineConfig = state?.config
  return (
    <>
      <hr />
      Colors:
      <br />
      <input type="checkbox" disabled checked={occupied(Color.Red, users)} />
      <button type="button" onClick={() => join(Color.Red)}>
        Red
      </button>
      <br />
      <input type="checkbox" disabled checked={occupied(Color.Green, users)} />
      <button type="button" onClick={() => join(Color.Green)}>
        Green
      </button>
      <br />
      <input type="checkbox" disabled checked={occupied(Color.Blue, users)} />
      <button type="button" onClick={() => join(Color.Blue)}>
        Blue
      </button>
      <br />
      <input type="checkbox" disabled checked={occupied(Color.White, users)} />
      <button type="button" onClick={() => join(Color.White)}>
        White
      </button>
      {/*-------------------------------------------*/}
      <hr />
      Configure:
      <br />
      <input type="radio" disabled checked={configured(Country.france, Length.long, engineConfig)} />
      <button type="button" onClick={() => config(Country.france, Length.long)}>
        France
      </button>
      <br />
      <input type="radio" disabled checked={configured(Country.france, Length.short, engineConfig)} />
      <button type="button" onClick={() => config(Country.france, Length.short)}>
        France+Short
      </button>
      <br />
      <input type="radio" disabled />
      <button type="button" disabled>
        Ireland
      </button>
      <br />
      <input type="radio" disabled />
      <button type="button" disabled>
        Ireland+Long
      </button>
      <br />
      <hr />
      <button type="button" disabled={users?.length === 0 || engineConfig === undefined} onClick={() => start()}>
        Start
      </button>
    </>
  )
}
