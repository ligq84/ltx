import MapData from './MapData.js';
import {loadDistricts} from "../api/index.js"
import _ from 'underscore';
import Block from './Block.js';
import {factory} from "../utility";


export default  class CityData extends MapData{
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
      factory.currentLoad = loadDistricts(query).then((datas)=>{

        this.removeAll();
        datas.forEach((data)=>{
          const district = new Block(data.id,data.name,data.xPoint,data.yPoint,data.groupNum,this.map);
          district.circle.addEventListener("click",this.onClick(district.id))
          district.topLabel.addEventListener("click",this.onClick(district.id))
          district.bottomLabel.addEventListener("click",this.onClick(district.id))
          district.resetZoom(this.zoom)
          this.datas.push(district);
          })
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
