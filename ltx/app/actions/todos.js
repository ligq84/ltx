import * as types from '../constants/ActionTypes';



export function init(condition) {
  return function(dispatch){
    dispatch(loadDistricts())

  }

}

export function updateBuildings(buildings) {
  return {type: types.UPDATE_BUILDINGS,buildings}
}

export function loadDistricts(){
  return {type:types.LOAD_DISTRICTS}
}
