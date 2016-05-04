import {INIT_INPUT} from '../constants/ActionTypes';
const initialState={
  value:""
}

export default function input(state = initialState, action) {

  switch (action.type) {

  case INIT_INPUT:
    return Object.assign({}, state, {
      value:action.value
    });
  default:
    return state;
  }
}
