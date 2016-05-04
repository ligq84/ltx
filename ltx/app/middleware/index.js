import api from "../api/index.js"
import * as types from '../constants/ActionTypes';
import _ from 'underscore'

export  function loadDistrictsMiddleware({ dispatch, getState }) {
  return next => action => {
    if(action.type === types.LOAD_DISTRICTS){
      if(!action.id){
        action.id=getState().city.id;
      }

      api.loadDistricts({cityId:action.id}).then(data =>{

        action.districts=data.filter((el)=>{
          return el.name != "上海市"
        });;
        action.districts.unshift({
          name:"不限",
          id:0
        })
        //如果 当前 行政区 不在 行政区list 中 ，就将当前 行政区 的id 赋值为0
        const result=_.find(action.districts,district=>{
          return district.id ==getState().district.id
        })
        action.id=_.isUndefined(result)?0:result.id;

        next(action);
      })
    }else{
      next(action);
    }
  }
}
export  function loadCitysMiddleware({ dispatch, getState }) {
  return next => action => {
    if(action.type === types.LOAD_CITYS){
      api.loadCitys().then(data =>{
        action.citys=data.data;
        const city =getState().city;
        const r=_.find(action.citys,c=>{
          return c.id ==city.id;
        })

        if(r){
          action.name=r.name;
        }

        next(action);
      })
    }else{
      next(action);
    }
  }
}

export  function loadCommsMiddleware({ dispatch, getState }) {
  return next => action => {
    if(action.type === types.LOAD_COMMS){
      //如果行政区为不限的时候 重置所以
      if(action.id==0){
        action.id=0;
        action.comms=[];
        next(action);

      }else{
        api.loadComms({districtId:action.id}).then(data =>{
          action.comms=data.data;
          action.comms.unshift({
            name:"不限",
            id:0
          })

          //如果 当前 商圈 不在 商圈list 中 ，就将当前 商圈 的id 赋值为0
          const result=_.find(action.comms,comm=>{
            return comm.id ==getState().comm.id
          })

          action.id=_.isUndefined(result)?0:result.id;


          next(action);
        })
      }

    }else{
      next(action);
    }
  }
}


export  function initCitysMiddleware({ dispatch, getState }) {
  return next => action => {
    if(action.type === types.INIT_CITY){
      if(_.isUndefined(action.id)){
        api.currentCity().then(data=>{
          action.id=data.data.cityId;

          next(action);
        })
      }else{

        const state=getState()
        if(state.city.data.length>0){

          const current=_.find(state.city.data,c=>{
            return c.id+"" == action.id
          })
          if(current){
            action.name= current.name ||"";
          }
        }
        next(action);
      }

    }else{
      next(action);
    }
  }
}

export function loadBuildingsMiddleware({dispatch, getState }){
    return next => action => {

      if(action.type ===types.LOAD_BUILDINGS){
        const state =  getState();
        const query = {
          cityId:state.city.id,
          districtId:state.district.id == 0?"":state.district.id,
          commId:state.comm.id == 0 ? "": state.comm.id,
          searchName:state.input.value,
          showNum:6,
          pageSize:12,
          minPrice:state.price.minPrice,
          maxPrice:state.price.maxPrice =="不限"?"":state.price.maxPrice,
          minArea:state.area.minArea,
          maxArea:state.area.maxArea =="不限"?"":state.area.maxArea
        }

        api.loadBuildings(query).then(data=>{
          action.data=data.data;
          action.fetching=false;
          next(action);
        })

      }else{
        next(action);
      }
    }
}
export function loadMapBuildingsMiddleware({dispatch, getState }){
  return next => action => {
    if(action.type ===types.LOAD_MAP_BUILDINGS&&action.screenScope){

      const state =  getState();
      const preQuery = {
        cityId:state.city.id,
        districtId:state.district.id == 0?"":state.district.id,
        commId:state.comm.id == 0 ? "": state.comm.id,
        searchName:state.input.value,
        showNum:6,
        minPrice:state.price.minPrice,
        maxPrice:state.price.maxPrice =="不限"?"":state.price.maxPrice,
        minArea:state.area.minArea,
        maxArea:state.area.maxArea =="不限"?"":state.area.maxArea
      }
      const query=Object.assign({},preQuery,action.screenScope)

      api.loadBuildings(query).then(data=>{
        action.data=data;
        next(action);
      })

    }else{
      next(action);
    }
  }
}


export function addBuildingsMiddleware({dispatch, getState }){
    return next => action => {

      if(action.type ===types.ADD_BUILDINGS){
        const state =  getState();
        if(state.building.currpage<state.building.totalpages){
          const query = {
            curPage:state.building.currpage+1,
            cityId:state.city.id,
            districtId:state.district.id == 0?"":state.district.id,
            commId:state.comm.id == 0 ? "": state.comm.id,
            searchName:state.input.value,
            showNum:6,
            pageSize:12,
            minPrice:state.price.minPrice,
            maxPrice:state.price.maxPrice =="不限"?"":state.price.maxPrice,
            minArea:state.area.minArea,
            maxArea:state.area.maxArea =="不限"?"":state.area.maxArea
          }

          api.loadBuildings(query).then(data=>{
            action.data=data.data;
            action.fetching=false;
            next(action);
          })

        }else {
          next(action);
        }


      }else{
        next(action);
      }
    }

}
