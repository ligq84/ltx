import {INIT_AREA} from '../constants/ActionTypes';
const initialState={
  minArea:0,
  maxArea:"不限"
}

export default function area(state = initialState, action) {
  switch (action.type) {
  case INIT_AREA:
    return Object.assign({}, state, {
      minArea:action.minArea,
      maxArea:action.maxArea
    });

  default:
    return state;
  }
}
