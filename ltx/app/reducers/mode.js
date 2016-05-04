import {CHANGE_MODE} from '../constants/ActionTypes';
const initialState={
  map:false
}

export default function mode(state = initialState, action) {
  switch (action.type) {
  case CHANGE_MODE:

    return Object.assign({}, state, {
      map:action.map
    });

  default:
    return state;
  }
}
