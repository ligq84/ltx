import * as types from '../constants/ActionTypes';
import _ from "underscore"



export function init(condition) {

  return function(dispatch,getState){
    const state = getState();

    dispatch(initCity(condition.cityId))
    if(condition.cityId){
      dispatch(loadCitys())
      dispatch(loadDistricts(condition.cityId))
    }else {
      setTimeout(()=>{
        dispatch(loadCitys())
        dispatch(loadDistricts())
      },1000)

    }




    if(condition.districtId){
      dispatch(initDistrict(condition.districtId||0))
      dispatch(loadComms(condition.districtId))
    }
    if(condition.commId){

      dispatch(initComm(condition.commId))

    }
    if(!_.isUndefined(condition.searchName)){

      dispatch(initInput(condition.searchName))
      dispatch(setFromInput(true))


    }
    if(!_.isUndefined(condition.minArea)&&!_.isUndefined(condition.maxArea)){
      dispatch(initArea(condition.minArea,condition.maxArea))
    }else if(!_.isUndefined(condition.minArea)){
      dispatch(initArea(condition.minArea,"不限"))
    }else if(!_.isUndefined(condition.maxArea)) {
      dispatch(initArea(0,condition.maxArea))
    }

    if(!_.isUndefined(condition.minPrice)&&!_.isUndefined(condition.maxPrice)){
      dispatch(initPrice(condition.minPrice,condition.maxPrice))
    }else if(!_.isUndefined(condition.minPrice)){
      dispatch(initPrice(condition.minPrice,"不限"))
    }else if(!_.isUndefined(condition.maxPrice)) {
      dispatch(initPrice(0,condition.maxPrice))
    }

    //如果是 大图模式
    if(!state.mode.map){
      dispatch(loadBuildings())
    }
    setTimeout(()=>{
      //如果是地图模式
      if(condition.mode==1){
        dispatch(changeMode(true));
      }
    },700)


  }
}

export function updateBuildings(buildings) {
  return {type: types.UPDATE_BUILDINGS,buildings}
}



export function initCity(id,callback){
  return {type:types.INIT_CITY,id}
}
export function loadCitys(){
  return {type:types.LOAD_CITYS}
}
export function changeCity(id){
  return function(dispatch,getState){
    const state = getState();
    dispatch(initCity(id))
    dispatch(initInput(""))
    dispatch(loadDistricts(id))
    dispatch(clearDistrict())
    dispatch(loadComms(0))
    if(!state.mode.map){
      dispatch(loadBuildings())
    }


  }
}

export function initCondition(condition){
  return {type:types.INIT_CONDITION,condition}
}

export function loadDistricts(id){
  return {type:types.LOAD_DISTRICTS}
}
export function initDistrict(id){
  return {type:types.INIT_DISTRICT,id}
}

export function changeDistrict(id){
  return (dispatch,getState)=>{
    const state = getState();
    dispatch(initDistrict(id))
    dispatch(cleaeComm())
    dispatch(loadComms(id))
    if(!state.mode.map){
      dispatch(loadBuildings())
    }

  }
}
export function clearDistrict(){
  return {type:types.CLEAR_DISTRICT}
}

export function loadComms(id){
  return {type:types.LOAD_COMMS,id}
}


export function initComm(id){
  return {type:types.INIT_COMM,id}
}


export function changeComm(id){
  return (dispatch,getState)=>{
    const state = getState();
    dispatch(initComm(id));
    if (!state.mode.map) {
      dispatch(loadBuildings())
    }

  }
}



export function searchInput(value,fromInput){
  return (dispatch,getState)=>{
    const state = getState();
    dispatch(initDistrict(0))
    dispatch(initInput(value))
    dispatch(cleaeComm())

    if (!state.mode.map) {
      dispatch(setFromInput(true))
      dispatch(loadBuildings())

    }else {
      //应该只有这里为true
      if(fromInput){
        dispatch(setFromInput(fromInput))
      }
      dispatch(loadBuildings())
    }
  }
}
export function setFromInput(fromInput){
  return {type:types.SET_FROM_INPUT,fromInput}
}


export function initInput(value){
  return {type:types.INIT_INPUT,value}

}

export function loadBuildings(){
  return dispatch=>{
      dispatch({type:types.LOAD_BUILDINGS});
      dispatch(startFetch());
      dispatch({type:types.REMOVE_BUILDINGS})
  }
}
export function startFetch(){
  return {type:types.START_FETCH,fetching:true}
}

export function cleaeComm(){
  return {type:types.CLEAR_COMM}
}

export function initArea(min,max){


  return {type:types.INIT_AREA,minArea:min,maxArea:max}

}

export function initPrice(min,max){

  return {type:types.INIT_PRICE,minPrice:min,maxPrice:max}

}

export function changePrice(price){
  return (dispatch,getState)=>{
    const state = getState();
    dispatch(initPrice(price.min,price.max))

    if (!state.mode.map) {
      dispatch(loadBuildings())
    }else{
      //改变行政区 和 商圈
      // dispatch(loadDistricts(state.city.id))
      // dispatch(loadComms(state.district.id))


    }
  }

}
export function changeArea(area){
  return (dispatch,getState)=>{
    const state = getState();
    dispatch(initArea(area.min,area.max));
    if (!state.mode.map) {
      dispatch(loadBuildings())
    }else {
      //改变行政区 和 商圈
      // dispatch(loadDistricts(state.city.id))
      // dispatch(loadComms(state.district.id))

    }
  }
}

export function addBuildings(){
  return  (dispatch,getState)=>{
    const state = getState();
    if(!state.building.fetching){
      dispatch(startFetch());
      dispatch({type:types.ADD_BUILDINGS})
    }

  }
}

export function changeMode(map){
  if(map){
    return {type:types.CHANGE_MODE,map}
  }else {

    return (dispatch)=>{
      dispatch({type:types.CHANGE_MODE,map})
      dispatch(loadBuildings())
    }
  }

}
export function loadMapBuildings(screenScope){
  return {type:types.LOAD_MAP_BUILDINGS,screenScope}
}
