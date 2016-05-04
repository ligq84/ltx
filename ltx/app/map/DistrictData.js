import MapData from './MapData.js';
import {loadComms} from "../api/index.js"
import _ from 'underscore';
import Block from './Block.js'
import {factory} from "../utility";

export default  class DistrictData extends MapData{
  constructor(id,blocks,map,callback){
    super(id,blocks,map);
    this.callback=callback;
  }
  update(query,zoom){

    if(!_.isEqual(this.query, query)){
      if(_.isFunction(this.whenBeforeUpdate)){
        this.whenBeforeUpdate()
      }

      factory.currentLoad?factory.currentLoad.abort():""
      factory.currentLoad=loadComms(query).then((datas)=>{
        this.removeAll();
        datas.data.forEach((data)=>{

          const comm = new Block(data.id,data.name,data.xPoint,data.yPoint,data.groupNum,this.map);
          comm.circle.addEventListener("click",this.onClick(comm.id))
          comm.topLabel.addEventListener("click",this.onClick(comm.id))
          comm.bottomLabel.addEventListener("click",this.onClick(comm.id))
          comm.resetZoom(this.zoom)

          this.datas.push(comm);
          })
          if(datas.data.length==1){
            const point = new BMap.Point(this.datas[0].x, this.datas[0].y);
            this.map.setCenter(point)
          }
          if(_.isFunction(this.whenAfterUpdate)){
            this.whenAfterUpdate()
          }
      })
      this.query=_.clone(query);
    }
    if(this.zoom !=zoom){
      this.resetAllZoom(zoom)
    }

  }
  onClick(id){
    return ()=>{
      this.callback(id)
    }
  }

}
