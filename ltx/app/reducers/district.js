import {LOAD_DISTRICTS,INIT_DISTRICT,CLEAR_DISTRICT} from '../constants/ActionTypes';
import _ from 'underscore';
import BlockState from './BlockState.js'
const initialState={
  id:0,
  data:[]
}

export default function districts(state = initialState, action) {
  switch (action.type) {
  case INIT_DISTRICT:
    return Object.assign({}, state, {
      id:action.id
    });

  case LOAD_DISTRICTS:
    return Object.assign({}, state, {
      data:action.districts,
      id:action.id
    });
  case CLEAR_DISTRICT:
    return Object.assign({}, state, {
      data:[],
      id:0
    });
  default:
    return state;
  }
}
