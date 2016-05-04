import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import District from '../map/District.js';
import Building from '../map/Building.js';
import {currentPosition,isBlockInBlockOverlays,factory} from '../utility/index.js';
import {loadComms} from "../api/index.js";
import api from "../api/index.js"
import CityData from '../map/CityData.js'
import DistrictData from '../map/DistrictData.js'
import CommData from '../map/CommData.js'



export default class BildingList extends Component {
  constructor(props, context){
    super(props, context);


  }
  initialize(){
    //初始化的时候 给 MaP添加一个方法
    BMap.Map.prototype.getXY=function(){
      return {
        maxx:this.getBounds().getNorthEast().lng,
        maxy:this.getBounds().getNorthEast().lat,
        minx:this.getBounds().getSouthWest().lng,
        miny:this.getBounds().getSouthWest().lat
      }
    }
    BMap.Map.prototype.isSameZoom=function(zoom){
      return this.getZoom()==zoom;

    }

    // 添加地图
    this.map=new BMap.Map("mainMap");

    //
    // this.forceUpdate()


    //初始化状态
    this.state = {
      isNeedReload: false,
      zoom:12,
      city:new CityData(this.props.city.id,this.props.city.data,this.map,this.props.changeDistrict),
      district:new DistrictData(this.props.district.id,this.props.district.data,this.map,this.props.changeComm),
      comm :new CommData(this.props.comm.id,this.props.comm.data,this.map),
      area:this.props.area,
      price:this.props.price,
      isShowLoading:false,
      isShowNoBuilding:false,
    };
    const self = this;
    this.state.comm.whenBeforeUpdate=function(){
      self.setState({
        isShowLoading:true,
        isShowNoBuilding:false
      })
    }
    this.state.comm.whenAfterUpdate=function(datas){
      if(datas.length>0){
        self.setState({
          isShowLoading:false
        })
      }else {
        self.setState({
          isShowLoading:false,
          isShowNoBuilding:true
        })

      }

    }

    this.state.district.whenBeforeUpdate=function(){
      self.setState({
        isShowLoading:true,
        isShowNoBuilding:false
      })
    }
    this.state.district.whenAfterUpdate=function(){
      self.setState({
        isShowLoading:false
      })
    }
    this.state.city.whenBeforeUpdate=function(){
      self.setState({
        isShowLoading:true,
        isShowNoBuilding:false
      })
    }
    this.state.city.whenAfterUpdate=function(){
      self.setState({
        isShowLoading:false
      })
    }



    factory["buildingMapState"]=this.state;

    var point;
    if(this.state.comm.id!=0){
      point=new BMap.Point(this.state.comm.x, this.state.comm.y);
      this.state.zoom=16

    }else if(this.state.district.id!=0){
      point=new BMap.Point(this.state.district.x, this.state.district.y);
      this.state.zoom=14

    }else if(this.state.city.id!=0){
      point=new BMap.Point(this.state.city.x, this.state.city.y);
      this.state.zoom=12;
    }




    //添加时间
    this.map.addEventListener("zoomend",()=>{
      const zoom = this.map.getZoom()
      this.setState({zoom:zoom})

      this.initMap();

      //
    })
    this.map.addEventListener("moveend",()=>{

      this.initMap();
    })

    //初始化的时候 会加载一次数据
    // this.loadDistrictsAndCommData(this.props)
    if(this.map.getCenter().lng==0&&this.map.getCenter().lat==0){
      this.map.centerAndZoom(point,this.state.zoom)
    }
    this.map.setMinZoom(12)


    if(this.props.building.fromInput&&this.props.building.data.length>0){
      const buildingId = this.props.building.data[0].buildingId;
      api.findBuildInfo(buildingId).then((building)=>{
        var  building = building.data;
        this.state.comm.setCenter(building.xPoint, building.yPoint,buildingId)
        this.state.zoom=16;

        const point = new BMap.Point(this.state.comm.x, this.state.comm.y);
        this.map.setCenter(point);

        //this.initMap()
      })

    }else {

      this.initMap();
    }



  }


  componentDidMount(){
    const self = this;
    window.initialize=function(){
      self.initialize();
    }
    var script = document.createElement("script");
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=37fQZDRYjBGdpbM3zXe1YNEK&callback=initialize";
    document.body.appendChild(script);


  }

  componentWillReceiveProps(nextProps) {

    //但搜索的时候
    if(!_.isEqual(this.props.building, nextProps.building)){

      if(nextProps.building.fromInput&&nextProps.building.data.length>0){
        const buildingId = nextProps.building.data[0].buildingId;
        api.findBuildInfo(buildingId).then((building)=>{
          var  building = building.data;
          this.state.comm.setCenter(building.xPoint, building.yPoint,buildingId)
          this.state.zoom=16;
          const point = new BMap.Point(this.state.comm.x, this.state.comm.y);
          this.map.setCenter(point);

          //this.initMap()
        })


      }


    }



    //当城市开始改变的时候
    if(nextProps.city.id!=this.props.city.id){

      this.state.city.setId(nextProps.city.id)
      //将坐标 移过去
      const point = new BMap.Point(this.state.city.x, this.state.city.y);
      this.map.setCenter(point);
      this.state.isNeedReload=true;

      //this.initMap()
    }
    //   //当城市改变完成的时候 清空行政区 清空商圈//当城市下的行政区域出现的时候//因为城市改变的结果是引起行政区域改变
    if(this.props.district.data.length==0&&nextProps.district.data.length>0){

    }



    //当行政区域 开始改变的时候
    if(this.props.district.id!=nextProps.district.id){

      //此刻说明行政区列表已加载完成
      this.state.district.setBlocks(nextProps.district.data);
      // 行政区域为不限的时候
      if(nextProps.district.id==0){
        this.state.zoom=12;
        this.state.isNeedReload=true;
        const point = new BMap.Point(this.state.city.x, this.state.city.y);
        this.map.setCenter(point);

        //this.initMap()
      }else{
        this.state.district.setId(nextProps.district.id)

        // this.state.district.removeAll()
        this.state.zoom=14;
        this.state.isNeedReload=true;
        const point = new BMap.Point(this.state.district.x, this.state.district.y);
        this.map.setCenter(point);
        this.state.isNeedReload=true;

        //this.initMap()
      }

    }


    if(this.props.comm.id!=nextProps.comm.id){

      //此刻说明行政区列表已加载完成
      this.state.comm.setBlocks(nextProps.comm.data);

      //商圈为不限的时候
      if(nextProps.comm.id==0){
        this.state.zoom=14;
        this.state.isNeedReload=true;
        const point = new BMap.Point(this.state.district.x, this.state.district.y);
        this.map.setCenter(point);
      }else{
        this.state.comm.setId(nextProps.comm.id)
        this.state.zoom=16;
        this.state.isNeedReload=true;
        const point = new BMap.Point(this.state.comm.x, this.state.comm.y);
        this.map.setCenter(point);
      }

      //this.initMap();
    }
    if(!_.isEqual(this.props.area, nextProps.area)){

      this.state.area=nextProps.area;
      this.state.comm.removeAll();
      this.state.district.removeAll();
      this.state.city.removeAll();
      this.state.isNeedReload=true;

      this.initMap();
    }
    if(!_.isEqual(this.props.price, nextProps.price)){

      this.state.price=nextProps.price;
      this.state.comm.removeAll();
      this.state.city.removeAll();
      this.state.district.removeAll();
      this.state.isNeedReload=true;

      this.initMap();
    }





  }
  initMap(){
    const zoom =  this.state.zoom;

    if(this.map.isSameZoom(zoom)){
      if(zoom<=13){
        this.whenZoomAtDistricts();
      }else
      if(zoom==14 || zoom == 15){
        this.whenZoomAtComms();
      }else
      if(zoom >= 16){
        this.whenZoomAtBuildings();
      }
    }else {
      this.map.setZoom(zoom)
    }
      this.state.isNeedReload=false;
  }
  whenZoomAtDistricts(){

      const zoom =  this.state.zoom;

      this.state.city.resetAllZoom(zoom)
      this.state.city.update(this.getQuery(),zoom)

      this.state.district.hideAll();
      this.state.comm.removeAll();
  }
  whenZoomAtComms(){
      const zoom =  this.state.zoom;

      this.state.district.resetAllZoom(zoom)
      const query = this.getQuery();
      query.districtId=this.state.district.id;
      //delete query.cityId

      this.state.district.update(query,zoom)
      // console.log(this.refs.mainMap.getDOMNode());
      this.state.city.hideAll();
      this.state.comm.removeAll();
  }
  whenZoomAtBuildings(){


    //状态为商圈的时候
    // console.log(98999);
    const state = this.state;

    const query=Object.assign({},this.getQuery(),this.map.getXY())
    this.state.comm.update(query)
    this.state.district.hideAll();
    this.state.city.hideAll();



  }

  getQuery(){
    return {
      cityId:this.state.city.id|| this.props.city.id,
      minPrice:this.state.price.minPrice,
      maxPrice:this.state.price.maxPrice =="不限"?"":this.state.price.maxPrice,
      minArea:this.state.area.minArea,
      maxArea:this.state.area.maxArea =="不限"?"":this.state.area.maxArea
    }
  }


  isLoading(){
    if(this.state){
      if(this.state.isShowLoading){
        return  <img className="map_loading" src="./img/map-loading.gif"></img>
      }
      if(this.state.isShowNoBuilding&&this.state.zoom>= 16){
        return  <img className="map_loading" src="./img/nobuilding.png"></img>
      }
    }

  }


  render() {
    return (
      <div ref="mainMap" style={{height:"100%",paddingTop:"44px",paddingLeft:"275px",position:"relative"}}>
        {this.isLoading()}
        <div  id="mainMap"  >
        </div>
      </div>
  );
  }
  componentWillUnmount(){
    this.state=null;
  }
}
