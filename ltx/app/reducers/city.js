import {LOAD_CITYS,INIT_CITY} from '../constants/ActionTypes';
import _ from 'underscore';



const initialState={
  id:0,
  data:[],
  name:""
}

export default function city(state = initialState, action) {
  switch (action.type) {
  case INIT_CITY:

    return Object.assign({}, state, {
      id:action.id,
      name:action.name||state.name,


    });
  case LOAD_CITYS:
    return Object.assign({}, state, {
      data:action.citys,
      name:action.name,

    });
  default:
    return state;
  }
}
