import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import ImageLoader from 'react-imageloader';
import BuildingItem from './BuildingItem.js';

export default class BildingList extends Component {
  render() {
    const {building,cityName,area,price,cityId}=this.props;
    const link=`&cityId=${cityId}&maxArea=${area.maxArea=='不限'?"":area.maxArea}&maxPrice=${price.maxPrice=='不限'?"":price.maxPrice}&minArea=${area.minArea}&minPrice=${price.minPrice}`


    return (

      <div className="building-list">

        {
          (building.totalpages==0 || building.totalpages==building.currpage)&&(!building.fetching)&&(building.totalCount>0)?"":<div className="top">
                    找到{building.totalCount}套符合要求的{cityName}租房
                  </div>
        }
        {building.data.map(b=>{
          return <BuildingItem link={link} building={b} cityId={cityId}></BuildingItem>
        })}
        {building.fetching?<div className="loading">
          <img src="img/loading.gif" alt="" />
        </div>:""}
        {
          (building.totalpages==0 || building.totalpages==building.currpage)&&(!building.fetching)&&(building.totalCount>0)?<div className="footer">
          没有找到更多的房源, 请试试其他搜索条件
        </div>:""
        }
        {
          (!building.fetching)&&(building.totalCount==0)?<div className="nobuilding">
          <img src="./img/footer-pic.png"></img>
          哇咔咔没有找到,委托小楼帮您找楼!
          <a  href="./entrust.html" id="entrust" className="entrust">立即委托</a>
        </div>:""

        }


      </div>


    );
  }
}
