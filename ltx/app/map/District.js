import Block from './Block.js';

export default  class District extends Block{
  constructor(id,name,x,y,groupNum,map,zoom=12){
    super(id,name,x,y,groupNum,map,zoom=12)
  }
}
