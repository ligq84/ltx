import React, { PropTypes, Component } from 'react';
import _ from 'underscore';

export default class DistrictItem extends Component {

  render() {
    const {district,changeDistrict} = this.props;
    return (
      <div className="item">
          <div className="item_name">
          区域
          </div>
          <ul className="item_content">
            {
              district.data.map(d=>{
                return <li key={d.id} id={"district"+d.id}  onClick={()=>changeDistrict(d.id)} className={d.id==district.id?"active":""}>{d.name}</li>
              })
            }
          </ul>
          
      </div>
    );
  }
}
