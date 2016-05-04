export default class BlockState {
  constructor(){
    this.id=0;
    this.data=[];
  }
  currentPosition(){
    const  r=_.find(this.data,c=>{
      return c.id ==this.id;
    })
    return {
      x:r.xPoint,
      y:r.yPoint
    }

  }


}
