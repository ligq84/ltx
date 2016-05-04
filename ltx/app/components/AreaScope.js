import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import ReactSlider from 'react-slider';




export default class AreaScope extends Component {

  constructor(props, context) {
    super(props, context);

    this.areaList=
    [{
        min:0,
        max:"不限"
      },{
      min:0,
      max:100
    },
    {
      min:100,
      max:200
    },
    {
      min:200,
      max:300
    },
    {
      min:300,
      max:500
    },
    {
      min:500,
      max:700
    },
    {
      min:700,
      max:1000
    }
    ,
    {
      min:1000,
      max:1500
    },
    {
      min:1500,
      max:2000
    },
    {
      min:2000,
      max:"不限"
    }
    ];
  }
  handleClick(i){

    this.props.changeArea(this.areaList[i])


  }



  render() {

    const area = this.props.area;

    return (

      <div className="item">
          <div className="item_name">
          面积 <span style={{fontWeight:"normal"}}>(m<sup>2</sup>)</span>
          </div>
          <ul className="item_content">
            {this.areaList.map((a,i)=>{
              if(a.max=="不限"){
                if(a.min==0){
                  return <li  key={i}   id={"area_unlimite"}   className={a.max==area.maxArea&&a.min==area.minArea?"active":""}  onClick={()=>{
                  this.handleClick(i)
                  }}>不限</li>

                }else {
                  return <li key={i} id={"area_"+a.min+"+"}   className={a.max==area.maxArea&&a.min==area.minArea?"active":""}  onClick={()=>{
                  this.handleClick(i)
                }} dangerouslySetInnerHTML={{__html: a.min+"+"}}></li>
                }

              }
              return <li  key={i} id={"area_"+a.min+"_"+a.max}  className={a.max==area.maxArea&&a.min==area.minArea?"active":""}   onClick={()=>{
                this.handleClick(i)
              }} dangerouslySetInnerHTML={{__html: a.min+"-"+a.max}}></li>
            })}
          </ul>
      </div>
    );
  }
}
