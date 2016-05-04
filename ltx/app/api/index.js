import reqwest from 'reqwest';
const host= "api"
export default {
  loadCitys: function() {
    return reqwest(host + '/findCity');
  },

  currentCity: function() {
    return reqwest(host + '/loadCity');
  },
  loadDistricts: function(query) {
    return reqwest({
      url: host+"/map/findDistrictStat",
      method: 'get',
      data: query
    })
  },
  loadComms: function(query){


    if(query.districtId!=0){

      var q = Object.assign({},query)
        delete q.cityId;
      return reqwest({
        url: host+"/map/findCommStat",
        method: 'get',
        data: q
      })
    }else {
      var q = Object.assign({},query)
        delete q.districtId;

      return reqwest({
        url: host+"/map/findCommByCityId",
        method: 'get',
        data: q
      })
    }

  },
  loadDistictTree: function() {
    return reqwest(host + '/loadDistictTree');
  },
  loadBuildings:function(query){
    return  reqwest({
      url: host+'/building/list',
      method: 'post',
      data: query,
    })
  },
  searchByKeyword:function(keyword,cityId){
    return reqwest({
      url: host+"/building/searchByKeyword",
      method: 'post',
      data: {
      keyword:keyword,
      cityId:cityId
      }
    })
  },
  findMapBuild:function(id){
    return reqwest(host+"/building/BuildingMapById/"+id)
  },
  findBuildInfo:(id)=>{
    return reqwest(host+"/building/info/"+id)
  }
}
