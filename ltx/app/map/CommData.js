import MapData from './MapData.js';
import {loadBuildings} from "../api/index.js"
import _ from 'underscore';
import Building from './Building.js'
import {factory} from "../utility";

export default  class CommData extends MapData{
  constructor(id,blocks,map){
    super(id,blocks,map);

  }
  update(query){

    if(!_.isEqual(this.query, query)){

      if(_.isFunction(this.whenBeforeUpdate)){
        this.whenBeforeUpdate()
      }

      factory.currentLoad?factory.currentLoad.abort():""
      factory.currentLoad =loadBuildings(query).then((datas)=>{
        datas.forEach((data)=>{
          const result=_.find(this.datas,(b)=>{
            return b.id == data.id;
          })
          if(!result){
            const building=  new Building(data.name,data.x,data.y,data.num,this.map,data.id)
            building.show();
            this.datas.push(building);
          }
        })
      this.query=_.clone(query);
      if(_.isFunction(this.whenAfterUpdate)){
        this.whenAfterUpdate(datas)
      }
      //在这里 佳

      // if(this.activeId){
      //   var activeId = this.activeId;
      //   var active= this.datas.filter(function(ele){
      //     return ele.id ==activeId;
      //   })
      //   //console.log(active[0]);
      //   if()
      //   active[0].onHover({target:{
      //     id:activeId
      //   }})
      // }


    });
    }
  }
  showAll(){
    this.datas.forEach(function(buildingOverlay) {
      if(buildingOverlay){
        buildingOverlay.show()
      }
    });
  }
  setCenter(x,y,activeId){

    this.x=x;
    this.y=y;
    this.activeId= activeId
  }
}
