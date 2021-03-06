import { combineReducers } from 'redux';
import {
  MODIFY_MOVES,
  REFRESH_MOVES,
  REQUEST_BOARD,
  RECEIVE_BOARD,
} from './actions';

function moves(state = 'config PLAYERS 4\nconfig LENGTH LONG\nconfig COUNTRY IRELAND\nstart\n', action) {
  switch (action.type) {
  case MODIFY_MOVES:
    return action.moves;
  default:
    return state;
  }
}

function board(state = {
  isFetching: false,
  didInvalidate: false,
  items: {},
}, action) {
  switch (action.type) {
  case REFRESH_MOVES:
    return Object.assign({}, state, {
      didInvalidate: true,
    });
  case REQUEST_BOARD:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
    });
  case RECEIVE_BOARD:
    return Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      items: action.board,
      lastUpdated: action.receivedAt,
    });
  default:
    console.warn('Invalid Action: ', action.type);
    return state;
  }
}

function boardByMoves(state = { }, action) {
  switch (action.type) {
  case REFRESH_MOVES:
  case RECEIVE_BOARD:
  case REQUEST_BOARD:
    return Object.assign({}, state, {
      [action.moves]: board(state[action.moves], action),
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  boardByMoves,
  moves,
});

export default rootReducer;
