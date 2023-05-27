import { Color, Country, EngineConfig, Length, User } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const occupied = (color: Color, users: User[] = []) => {
  return users.some((user) => user.color === color)
}

const configured = (country: Country, length: Length, config?: EngineConfig) =>
  config && config.country === country && config.length === length

export const StateSetup = () => {
  const { state, join, config, start } = useHathoraContext()
  const users = state?.users ?? []
  const engineConfig = state?.config
  return (
    <>
      <h1>Game Setup</h1>
      <p>Share the URL of this page with all players. Have them come here and select a color.</p>
      <p>
        France and Ireland use a mostly different set of buildings. The 2 player game has the smallest subset of
        buildings, usually around 36+ rounds where the action order goes 1-2, 2-1, 1-2, 2,1... so each player gets 2
        actions in a row. In the long 2-player game, nearly all buidings from the 4-player game are used and action
        order goes 1-1-2, 2-2-1, 1-1-2, ... so each player gets 3 actionsin a row. The 3 and 4 player standard games use
        a larger set of buildings over 24 rounds. Short games are only 12 and 8 rounds, respectively, and each player
        only gets 2 clergy and resources are distributed more often.
      </p>
      <hr />
      <h3>Players ({users?.length})</h3>
      <input type="checkbox" disabled checked={occupied(Color.Red, users)} />
      <button type="button" disabled={occupied(Color.Red, users)} onClick={() => join(Color.Red)}>
        Red
      </button>
      {JSON.stringify(users)}
      <br />
      <input type="checkbox" disabled checked={occupied(Color.Green, users)} />
      <button type="button" disabled={occupied(Color.Green, users)} onClick={() => join(Color.Green)}>
        Green
      </button>
      <br />
      <input type="checkbox" disabled checked={occupied(Color.Blue, users)} />
      <button type="button" disabled={occupied(Color.Blue, users)} onClick={() => join(Color.Blue)}>
        Blue
      </button>
      <br />
      <input type="checkbox" disabled checked={occupied(Color.White, users)} />
      <button type="button" disabled={occupied(Color.White, users)} onClick={() => join(Color.White)}>
        White
      </button>
      <p>Player order will be randomized upon start.</p>
      {/*-------------------------------------------*/}
      <hr />
      <h3>Mode</h3>
      <input type="radio" disabled checked={configured(Country.france, Length.long, engineConfig)} />
      <button
        type="button"
        disabled={configured(Country.france, Length.long, engineConfig)}
        onClick={() => config(Country.france, Length.long)}
      >
        France {users?.length === 2 && '(long)'}
      </button>
      <br />
      <input type="radio" disabled checked={configured(Country.ireland, Length.long, engineConfig)} />
      <button
        disabled={configured(Country.ireland, Length.long, engineConfig)}
        onClick={() => config(Country.ireland, Length.long)}
        type="button"
      >
        Ireland {users?.length === 2 && '(long)'}
      </button>
      <br />
      {users.length > 1 && (
        <>
          {' '}
          <input type="radio" disabled checked={configured(Country.ireland, Length.short, engineConfig)} />
          <button
            type="button"
            disabled={configured(Country.ireland, Length.short, engineConfig)}
            onClick={() => config(Country.ireland, Length.short)}
          >
            Ireland {users?.length >= 3 && '(short)'}
          </button>
          <br />
          <input type="radio" disabled checked={configured(Country.france, Length.short, engineConfig)} />
          <button
            type="button"
            disabled={configured(Country.france, Length.short, engineConfig)}
            onClick={() => config(Country.france, Length.short)}
          >
            France {users?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      <p>
        Each variant has a different set of buildings, with only 15 of the 41 buildings are shared between both. France
        includes buildings like the Windmill and Bakery to produce bread, and Vineyards which produce grapes which can
        be turned into wine which can be consumed instead of paying for a work contract. Ireland includes buildings like
        the Malthouse and Brewery to turn Grain into malt and then into beer, as well as the Whiskey Distillery which
        turns malt into whiskey which can also be consumed for a work contract.
      </p>
      <hr />
      <button type="button" disabled={users?.length === 0 || engineConfig === undefined} onClick={() => start()}>
        Start
      </button>
    </>
  )
}
