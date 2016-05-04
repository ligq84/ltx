export default class Block {


  constructor(id,name,x,y,groupNum,map,zoom=12){
    this.id=id;
    this.name=name;
    this.x=parseFloat(x);
    this.y=parseFloat(y);
    this.groupNum=groupNum;
    this.map=map;
    this.zoom=zoom;
    this.style={
      color:"#fff",
      textAlign:'right',
      backgroundColor:'transparent',
      border:'0px',
      fontWeight:600
    }


    this.backgroundColor='#e56565';
    this.activeColor='#c80000';
    this.radii=2000;
    this.basicZoom=12;
    this.deviation={
      top:{
        x : -0.0119,
        y : 0.008
      },
      bottom:{
        x : -0.01,
        y : 0
      }
    }



    this.topLabelPoint= new BMap.Point(
          parseFloat(this.x)+this.deviation.top.x,
          parseFloat(this.y)+this.deviation.top.y)
    this.topLabel=new BMap.Label(this.name,{
          position:this.topLabelPoint
        })
    this.topLabel.setStyle(this.style)
    this.topLabel.disableMassClear()
    //底部标签
    this.bottomLabelPoint=new BMap.Point(
      parseFloat(this.x)+this.deviation.bottom.x,
      parseFloat(this.y)+this.deviation.bottom.y)
    this.bottomLabel=new BMap.Label(this.groupNum+'套',{
      position:this.bottomLabelPoint
    })
    this.bottomLabel.setStyle(this.style)
    this.bottomLabel.disableMassClear()

    this.circlePoint = new BMap.Point(this.x,this.y)
    this.circle = new BMap.Circle(this.circlePoint);


    this.circle.addEventListener('mouseover',(e)=>{
      this.circle.setFillColor(this.activeColor)
      this.circle.setStrokeColor(this.activeColor)
      this.circle.setStrokeOpacity(0.9)
      this.circle.setFillOpacity(0.9)
    })


    this.circle.addEventListener('mouseout',(e)=>{
      this.circle.setStrokeColor(this.backgroundColor)
      this.circle.setFillColor(this.backgroundColor)

    })
    this.circle.setStrokeWeight(1)
    this.circle.setStrokeOpacity(0.9)
    this.circle.setFillOpacity(0.9)
    this.circle.setStrokeColor(this.backgroundColor)
    this.circle.setFillColor(this.backgroundColor)
    this.circle.disableMassClear()
  }

  resetZoom(zoom){
      const level =parseFloat(zoom)-parseFloat(this.basicZoom)
      const l=Math.pow(2, level)
      this.circle.setRadius(this.radii/l)
      this.topLabelPoint.lng=this.x+this.deviation.top.x/l
      this.topLabelPoint.lat=this.y+this.deviation.top.y/l
      this.bottomLabelPoint.lng=this.x+this.deviation.bottom.x/l
      this.bottomLabelPoint.lat=this.y+this.deviation.bottom.y/l
      this.show()

  }
  show(){

    this.map.addOverlay(this.topLabel)
    this.map.addOverlay(this.bottomLabel)
    this.map.addOverlay(this.circle)
  }
  hide(){
    this.map.removeOverlay(this.circle)
    this.map.removeOverlay(this.topLabel)
    this.map.removeOverlay(this.bottomLabel)
  }



}
