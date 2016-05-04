import {INIT,LOAD_DISTRICTS} from '../constants/ActionTypes';
import _ from 'underscore';
import api from '../api/index.js'

const initialState = {
  citys:[],
  cityId:0,
  districts:[],
  districtId:0,
  comms:[],
  commId:0,
  minPrice:0,
  maxPrice:0,
  minArea:0,
  maxArea:0,
  buildings:[],
  searchName:'',
  curPage:1,
  pageSize:8
};

export default function init(state = initialState, action) {

  switch (action.type) {
  case INIT:
  console.log(8888);
    // alert(action.type);
    return {}
  case LOAD_DISTRICTS:
    console.log(action.districts);
    return {}

  default:
    return state;
  }
}
