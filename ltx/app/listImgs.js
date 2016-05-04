import 'babel-core/polyfill';
import React from 'react';
import { createStore,applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import main from './containers/Main.js';
import _ from 'underscore';
import reducers from './reducers/index.js'
import {init,addBuildings} from './actions/index.js';
import utility from './utility/index.js';
import {loadDistrictsMiddleware,loadCitysMiddleware,initCitysMiddleware,loadCommsMiddleware,loadBuildingsMiddleware,addBuildingsMiddleware,loadMapBuildingsMiddleware} from './middleware/index.js'
import thunkMiddleware from 'redux-thunk';


const vanillaPromise = store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action);
  }
  return Promise.resolve(action).then(store.dispatch);
};


let finalCreateStore=applyMiddleware(
  thunkMiddleware,
  loadDistrictsMiddleware,
  loadCitysMiddleware,
  initCitysMiddleware,
  loadCommsMiddleware,
  loadBuildingsMiddleware,
  addBuildingsMiddleware,
  loadMapBuildingsMiddleware
)(createStore)
const store = finalCreateStore(reducers);

store.dispatch(init(utility.getUrlVars()))








// Map Redux state to component props
function mapStateToProps(state)  {

  return {
    city:state.city,
    district:state.district,
    comm:state.comm,
    input:state.input,
    building:state.building,
    area:state.area,
    price:state.price,
    mode:state.mode,
    map:state.map
  };
}








setTimeout(()=>{
  $(window).scroll(function(){
  　　var scrollTop = $(this).scrollTop();
  　　var scrollHeight = $(document).height();
  　　var windowHeight = $(this).height();
  　　if(scrollTop>100&&scrollTop + windowHeight == scrollHeight){
        const building=store.getState().building;
        if((building.currpage)<building.totalpages){

          store.dispatch(addBuildings())
        }
  　　　　
  　　}
  });
},2000)




// Connected Component:
let App = connect(
  mapStateToProps
)(main);

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('root')
);
