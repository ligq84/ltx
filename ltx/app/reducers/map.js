import {LOAD_MAP_BUILDINGS} from '../constants/ActionTypes';
const initialState={
  data:[]
}

export default function map(state = initialState, action) {
  switch (action.type) {
  case LOAD_MAP_BUILDINGS:
    return Object.assign({}, state, {
      data:action.data

    });

  default:
    return state;
  }
}
