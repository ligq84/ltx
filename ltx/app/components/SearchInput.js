import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import api from '../api/index.js'

export default class SearchInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      list:[],
      isOpen:false,
      value:props.value
    };
  }
  handleChange(e){
    const value = e.target.value.trim();
      this.setState({ value: value });
        //ie 把有时候 会监听到 kong
    if(value!=""){
      api.searchByKeyword(value,this.props.cityId).then(data=>{
        this.setState({ list: data.data,isOpen:true });
      })
    }
  }
  handleKeyup(e){

    if(e.keyCode===13){
      this.props.searchInput(this.state.value,true)
    }
    if(e.keyCode===8&&e.target.value==""){
      this.props.searchInput(this.state.value,true)
    }

  //  console.log(e.target.value,);

  }

  handleItemClick(name){

    this.setState({value:name,isOpen:false });
    this.props.searchInput(name)

  }
  handleSearch(){
    this.setState({isOpen:false})
    //来之 input 的查询
    if(this.state.value){
      this.props.searchInput(this.state.value,true)
    }

  }

  render() {
    const {changeInput,value} = this.props;

    return (
      <div className="top">
          <input type="text"
            placeholder="请输入楼盘名称"
            value={this.state.value}
            onKeyUp={this.handleKeyup.bind(this)}
            onChange={this.handleChange.bind(this)}/>
              <div id="search-btn" onClick={(e)=>{
                        this.handleSearch()
                      }}></div>
          <ul style={{display:this.state.isOpen?"block":"none"}}>
            {
              this.state.list.map(e=>{
                return   <li onClick={()=>{
                  this.handleItemClick(e.fullName)
                }}>{e.fullName}</li>
              })

            }

          </ul>
      </div>
    );
  }
}
