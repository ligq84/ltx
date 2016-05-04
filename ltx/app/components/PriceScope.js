import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import ReactSlider from 'react-slider';




export default class PriceScope extends Component {

  constructor(props, context) {
    super(props, context);


    this.priceList=[{
        min:0,
        max:"不限"
      },{
      min:0,
      max:1
    },
    {
      min:1,
      max:2
    },
    {
      min:2,
      max:3
    },
    {
      min:3,
      max:4
    },
    {
      min:4,
      max:5
    },
    {
      min:5,
      max:6
    },
    {
      min:6,
      max:7
    },
    {
      min:7,
      max:8
    },
    {
      min:8,
      max:9
    },
    {
      min:9,
      max:'不限'
    }
    ];
  }
  handleClick(i){
    this.props.changePrice(this.priceList[i])



  }



  render() {

    const price = this.props.price;

    return (

      <div className="item">
          <div className="item_name">
          租金 <span style={{fontWeight:"normal"}}>(元/m<sup>2</sup>天)</span>
          </div>
          <ul className="item_content" style={{height:'180px'}}>
            {this.priceList.map((p,i)=>{

              if(p.max=="不限"){
                 if(p.min==0){
                   return <li  key={i} id={"price_unlimite"}  className={p.max==price.maxPrice&&p.min==price.minPrice?"active":""}  onClick={()=>{
                   this.handleClick(i)
                   }}>不限</li>
                 }else {
                   return <li key={i} id={"price_"+p.min+"+"}  className={p.max==price.maxPrice&&p.min==price.minPrice?"active":""}  onClick={()=>{
                   this.handleClick(i)
                 }} dangerouslySetInnerHTML={{__html: p.min+"+"}}></li>

                 }
              }
              return <li  key={i} id={"price_"+p.min+"_"+p.max} className={p.max==price.maxPrice&&p.min==price.minPrice?"active":""}   onClick={()=>{
                this.handleClick(i)
              }} dangerouslySetInnerHTML={{__html: p.min+"-"+p.max}}></li>
            })}
          </ul>
      </div>
    );
  }
}
