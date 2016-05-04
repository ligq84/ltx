import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import ImageLoader from 'react-imageloader';

export default class BildingItem extends Component {

  constructor(props) {
  super(props);
  this.state = {showImg:false};
  }


  handleHover(e){
    if(!this.state.showImg){
        this.setState({showImg:true})
    }


  }


  render(){
    const {building,link,cityId} = this.props;
    return (<div className="item">
              <div className="top" onMouseEnter={this.handleHover.bind(this)} >
                <a href={"projectDetail.html?buildingId="+building.buildingId+link} target="_blank">
                  <ImageLoader
                    src={building.buildingImage||'img/default_bb.png'}
                    wrapper={React.DOM.div}
                    preloader={()=>{
                      return <img src="img/default_bb.png"></img>
                    }}>
                    </ImageLoader>
                </a>
                <div className="name"  ref="name" >
                {building.buildingName}
                </div>
                <ul ref="imgs" >
                  {building.unitList.map((u,i)=>{
                    if(i<3){
                      return   <li>
                                  <a href={"projectDetail.html?buildingId="+building.buildingId+link}  target="_blank">
                                  <span>{u.unitArea}m<sup>2</sup></span>
                                  <span className="item-price" >{u.rent}元/m<sup>2</sup>.天</span>
                                  {this.state&&this.state.showImg?<img src={u.unitImage||'img/default_bb.png'}></img>:<img src={'img/default_bb.png'}></img>}
                                  </a>
                                </li>
                    }
                  })}
                  {parseInt(building.suitableNum)>3?(<li className="bottom">
                  <a target="_blank" href={`projectDetail.html?buildingId=`+building.buildingId+link+"#rent"}>查看更多</a>
                  </li>):""}
                </ul>
              </div>
              <div className="bottom">
                <span className="price">{building.averageRent}<span className="unit">元/m<sup>2</sup>.天</span></span>
                <span className="num">{building.suitableNum}套房源</span>
              </div>
          </div>)
  }
}
