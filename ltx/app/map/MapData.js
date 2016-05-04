import _ from 'underscore';
export default  class MapData {
  constructor(id,blocks,map){
    this.blocks=blocks;
    this.setId(id);
    this.datas=[];
    this.query={};
    this.zoom = 0;
    this.map =map;
  }
  hideAll(){
    this.datas.forEach((data)=>{
      if(data){
        data.hide();
      }
    })
  }
  resetAllZoom(zoom){
    this.zoom = zoom;
    this.datas.forEach((data)=>{
      data.resetZoom(zoom)
    })
  }
  removeAll(){
    const len = this.datas.length;
    for(let i = 0;i<len;i++){
        const b = this.datas.shift();
        b.hide();
    }
  }
  setId(id){
    const  result=_.find(this.blocks,c=>{
      return c.id == id;
    })
    this.id=id;
    if(result){
      this.x=result.xPoint;
      this.y=result.yPoint;
    }

  }
  setBlocks(blocks){
    this.blocks=blocks;
    this.id=0;
  }

}
