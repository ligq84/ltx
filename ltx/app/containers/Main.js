import React, { Component, PropTypes } from 'react';
import Header from '../components/Header.js';
import SearchInput from '../components/SearchInput.js';
import CommItem from '../components/CommItem.js';
import DistrictItem from '../components/DistrictItem.js';
import BuildingList from '../components/BuildingList.js';
import AreaScope from '../components/AreaScope.js';
import PriceScope from "../components/PriceScope.js";
import { bindActionCreators } from 'redux';
import * as allActions from '../actions/index.js';
import BuildingMap from '../components/BuildingMap.js';
import _ from 'underscore';
// export buildingMapState = {}

export default class Main extends Component {



  render() {
    // Injected by connect() call:
    const {city,district,dispatch,comm,input,building,area,price,mode,map} = this.props;
    const actions = bindActionCreators(allActions, dispatch);
    const {isUndefined} = _;
    const changeCity=function(id){
      this.refs.searchInput.setState({value:""})
      actions.changeCity(id)
    }


    return (

      <div>
        <Header city={city} changeCity={changeCity.bind(this)}  mode={mode} changeMode={actions.changeMode}>
        </Header>
        <div className="map_left">
          <SearchInput cityId={city.id} value={input.value} searchInput={actions.searchInput} ref="searchInput">
          </SearchInput>
          <DistrictItem district={district} changeDistrict={actions.changeDistrict}>
          </DistrictItem>
          {comm.data.length>0?<CommItem comm={comm} district={district}  changeComm={actions.changeComm}></CommItem>:''}

          <AreaScope area={area} changeArea={actions.changeArea}>
          </AreaScope>
          <PriceScope price={price} changePrice={actions.changePrice}>
          </PriceScope>
        </div>
        {mode&&mode.map?
          <BuildingMap
            city={city}
            district={district}
            comm={comm}
            area={area}
            price={price}
            map={map}
            building={building}
            loadMapBuildings={actions.loadMapBuildings}
            changeDistrict={actions.changeDistrict}
            changeComm={actions.changeComm}>

          </BuildingMap>:
          <BuildingList
            cityId={city.id}
            building={building}
            area={area}
            price={price}
            cityName={city.name}
            >
          </BuildingList>}
      </div>
    );
  }
}
