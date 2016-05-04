import {LOAD_COMMS,INIT_COMM,CLEAR_COMM} from '../constants/ActionTypes';
import _ from 'underscore';
import BlockState from './BlockState.js'

const initialState={
  id:0,
  data:[]
}



export default function comm(state = initialState, action) {
  switch (action.type) {
  case INIT_COMM:

    return Object.assign({}, state, {
      id:action.id
    });
  case LOAD_COMMS:
    return Object.assign({}, state, {
      data:action.comms,
      id:action.id
    });
  case CLEAR_COMM:
    return Object.assign({}, state, {
      data:[],
      id:0
    });
  default:
    return state;
  }
}
