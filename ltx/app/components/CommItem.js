import React, { PropTypes, Component } from 'react';
import _ from 'underscore';

export default class CommItem extends Component {

  render() {
    const {comm,changeComm,district}=this.props;
  
    return (

      <div className="item" style={{borderTop:"1px solid #CCC"}}>
      <ul className="item_content">
        {
           comm.data.map(d=>{
            return <li key={d.id}  onClick={()=>changeComm(d.id)} id={district.id+"comm"+d.id}className={d.id==comm.id?"active":""}>{d.name}</li>
          })
        }
      </ul>
      </div>
    );
  }
}
