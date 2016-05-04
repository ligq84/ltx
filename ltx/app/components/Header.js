import React, { PropTypes, Component } from 'react';
import _ from 'underscore';

class Header extends Component {
  getCurrentCityName(city){
    if(city.data.length>0 && city.id!= 0){
      var current=_.find(city.data,c=>{
        return c.id+"" == city.id
      })
      if(current){

        return current.name ||"";
      }

    }
    return "";

  } 

  render() {
    const {city,changeCity,mode,changeMode} = this.props;
    return (
      <div className="map_header">
          <a href={"index.html?cityId="+city.id}><img src="img/logo.png" height="33px" width="73px"></img></a>
          <div>
              <span>{this.getCurrentCityName(city)}</span>
              <img src="img/arrow_bottom_grey.png" width="8" height="4px" alt=""></img>
              <ul >
                {city.data.map(c=>{
                  return <li onClick={()=>{
                    if(city.id!=c.id){
                      changeCity(c.id)
                    }
                    }}><a>{c.name}</a></li>
                })}
              </ul>
            </div>
            {mode&&!mode.map?<div className="mode"><img src="../img/mapmode.png"></img><span onClick={()=>{changeMode(true)}}>地图模式</span></div>:<div className="mode"><img src="../img/datumode.png"></img><span onClick={()=>{
              changeMode(false)
            }}>大图模式</span></div>}
      </div>
    );
  }
}

export default Header;
