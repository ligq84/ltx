import {INIT_PRICE} from '../constants/ActionTypes';
const initialState={
  minPrice:0,
  maxPrice:"不限"
}

export default function area(state = initialState, action) {
  switch (action.type) {
  case INIT_PRICE:
    return Object.assign({}, state, {
      minPrice:action.minPrice,
      maxPrice:action.maxPrice
    });

  default:
    return state;
  }
}
