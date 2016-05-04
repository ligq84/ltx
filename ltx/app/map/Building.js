import api from "../api/index.js";
import React from "react";
import {factory} from "../utility/index.js";

export default class Buildings {


  constructor(name,x,y,num,map,id,city){
    this.hasHover=false;
    this.name=name;
    this.x=parseFloat(x);
    this.y=parseFloat(y);
    this.num=num;
    this.map=map;
    this.id=id;
    this.point=new BMap.Point(this.x,this.y)
    this.label=new BMap.Label(this.name)
    this.label.id  = this.id
    this.label.setStyle({
      backgroundColor:"#c83000",
      color:"#fff",
      border:"0px",
      width:"auto",
      padding:"0px"
    })
    this.label.setContent(`
    <p class="point3" data-id=${this.id}>
      <i class="map_project_detail">
        <img class="building-detail" src="./img/building-map-detail.gif" />
        <img class="arrow" src="img/sanjiao.png" />
      </i>
      <i class="num micon-map">${this.num}套</i>
      <i class="arrow"></i>
    </p>
    `)

    this.label.setPosition(this.point)
    this.label.addEventListener("mouseover",this.onHover)
    // console.log(this.label);
  }


  show(){

    this.map.addOverlay(this.label)
  }
  hide(){
    this.map.removeOverlay(this.label)

  }

  onHover(e){
    // $('.map_project_detail').remove();
    const target = e.target;
    const id= target.id;
    const p= $(`p[data-id=${id}]`)
    var loadingImg =  p.find("i.map_project_detail>img.building-detail");

    if(loadingImg.length!=0&&!this.hasHover){
      this.hasHover=true;
      api.findMapBuild(id).then(data=>{

        loadingImg.remove();

        const projectDetail=  p.find("i.map_project_detail");
        projectDetail.css("background-color","#fff")
        projectDetail.css("border","1px solid #ccc")
        const floors= data.data
        if(!floors[0].bpath){
          floors[0].bpath = "./img/default_bb.png"
        }
        //<label>${floors[0].bname}<label>
        const img =$(`
        <div class="top-img">
          <img width="258px" ></img>
          <label>${floors[0].bname}</label>
        </div>
        `)
        img.find('img').attr('src',floors[0].bpath)

        img.bind("click",()=>{
          window.open(`
            projectDetail.html?buildingId=${id}&cityId=${factory["buildingMapState"].city.id}&minArea=${factory["buildingMapState"].area.minArea}&maxArea=${factory["buildingMapState"].area.maxArea=="不限"?"":factory["buildingMapState"].area.maxArea}&minPrice=${factory["buildingMapState"].price.minPrice}&maxPrice=${factory["buildingMapState"].price.maxPrice=="不限"?"":factory["buildingMapState"].price.maxPrice}
            `)
        })


        const floorEles =$(`<ul></ul>`)
        const moreEles = $(`<div>
        <a href="projectDetail.html?buildingId=${id}&cityId=${factory["buildingMapState"].city.id}&minArea=${factory["buildingMapState"].area.minArea}&maxArea=${factory["buildingMapState"].area.maxArea=="不限"?"":factory["buildingMapState"].area.maxArea}&minPrice=${factory["buildingMapState"].price.minPrice}&maxPrice=${factory["buildingMapState"].price.maxPrice=="不限"?"":factory["buildingMapState"].price.maxPrice}"target="_blank">
        查看更多<a>
        </div>
        `)
        floors.forEach((floor,index)=>{
          if(index<3){
            //<a href="floorDetail.html?groupId=${floor.bgroupId}&cityId=${factory["buildingMapState"].city.id}&buildingId=${id}"  target="_blank">详细信息</a>
            floorEles.append(`<li style="text-align:left">
              <span style="float:right"><span>${floor.rentPrice||""}元/m<sup>2</sup>.天 </span></span>
              <span >${floor.unitArea}m<sup>2</sup></span>

              </li>`)
          }else if(index = 3){
            floorEles.append(moreEles)
          }
        })
        projectDetail.append(img)
        projectDetail.append(floorEles)
      })
    }


  }
}
