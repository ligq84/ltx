import {LOAD_BUILDINGS,START_FETCH,REMOVE_BUILDINGS,ADD_BUILDINGS,SET_FROM_INPUT} from '../constants/ActionTypes';
const initialState={
  currpage:1,
  totalpages:0,
  totalCount:0,
  data:[],
  fetching:false,
  //通过查询得到
  fromInput:false,
}

export default function building(state = initialState, action) {
  switch (action.type) {
  case LOAD_BUILDINGS:
    return Object.assign({}, state, {
      currpage:action.data.currpage,
      totalpages:action.data.totalpages,
      totalCount:action.data.totalCount,
      data:action.data.resultList,
      fetching:action.fetching
    });
  case ADD_BUILDINGS:
    return Object.assign({}, state, {
      currpage:action.data.currpage,
      totalpages:action.data.totalpages,
      totalCount:action.data.totalCount,
      data:state.data.concat(action.data.resultList),
      fetching:action.fetching

    });
  case START_FETCH:
    return Object.assign({}, state, {
      fetching:action.fetching
    });
  case REMOVE_BUILDINGS:
    return Object.assign({}, state, {
      data:[]
    });
  case SET_FROM_INPUT:
    return Object.assign({}, state, {
      fromInput:action.fromInput
    });
  default:
    return state;
  }
}
