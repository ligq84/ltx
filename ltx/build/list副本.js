var addBuilding, addComm, addDistrict, addUnit, generateComm, generateDistrictByCityId, isMore, loadBuilding, onScroll2Bottom, query, reLoadBuilding, showComm, urlVars;

query = {
  curPage: 1,
  pageSize: 8
};

urlVars = {};

isMore = false;

$(function() {
  urlVars = $.getUrlVars();
  _.extend(query, urlVars);
  query.minArea = query.minArea || 0;
  query.maxArea = query.maxArea || 2000;
  query.minPrice = query.minPrice || 0;
  query.maxPrice = query.maxPrice || 9;
  loadCity(urlVars.cityId, function(cityId) {
    generateDistrictByCityId(cityId);
    query.curPage = 1;
    return reLoadBuilding();
  });
  loadBuilding().done(function() {
    return onScroll2Bottom();
  });
  if (query.searchName != null) {
    $('input.index-input').val(query.searchName);
  }
  $('#search-btn').bind('click', function() {
    query.searchName = $('input.index-input').val();
    return reLoadBuilding();
  });
  $('#areaBox').slipping({
    unit: 2000,
    postfix: '',
    min: query.minArea,
    max: query.maxArea,
    onEnd: function(n) {
      query.minArea = this.min;
      query.maxArea = this.max;
      console.log(query);
      return reLoadBuilding();
    }
  });
  return $('#priceBox').slipping({
    unit: 9,
    postfix: '',
    min: query.minPrice,
    max: query.maxPrice,
    onEnd: function() {
      query.minPrice = this.min;
      query.maxPrice = this.max;
      return reLoadBuilding();
    }
  });
});

onScroll2Bottom = function() {
  var loadOnce;
  loadOnce = 0;
  return $(document).scroll(function() {
    var height, scrollHeight;
    height = $('html .search-cont>#buildings').outerHeight();
    scrollHeight = $('html .search-cont').scrollTop() + $(window).outerHeight() + 100;
    if (!isMore) {
      $('.loading').hide();
    }
    if (scrollHeight > height && loadOnce === 0 && isMore) {
      loadOnce = 1;
      return loadBuilding(query).done(function() {
        return loadOnce = 0;
      });
    }
  });
};

generateDistrictByCityId = function(cityId) {
  query.cityId = cityId;
  return api.findDistrict(cityId).success(function(data) {
    var dis, districts, i, len, results;
    $('#district>a').remove();
    districts = data.data;
    districts.unshift({
      name: '不限'
    });
    results = [];
    for (i = 0, len = districts.length; i < len; i++) {
      dis = districts[i];
      results.push(addDistrict(dis, $('#district')));
    }
    return results;
  });
};

addDistrict = function(district, ele) {
  var districtEle;
  districtEle = $("<a href='#' district-id=" + (district.id || '') + ">" + district.name + "\n</a>");
  if (query.districtId != null) {
    if (query.districtId === district.id + "") {
      showComm(districtEle, district.id);
    }
  } else {
    if (district.name === '全部') {
      showComm(districtEle, district.id);
    }
  }
  districtEle.bind('click', function() {
    districtEle.siblings().removeClass('active');
    showComm(districtEle, districtEle.attr('district-id'));
    query.districtId = districtEle.attr('district-id');
    delete query.commId;
    if (query.districtId == null) {
      delete query.districtId;
    }
    return reLoadBuilding();
  });
  return ele.append(districtEle);
};

showComm = function(ele, id) {
  var commsEle, dd;
  ele.addClass('active');
  dd = $("dd.cond#area");
  commsEle = dd.find("div.sub-cond#district" + id);
  if (commsEle.length === 0) {
    return generateComm(id, dd);
  } else {
    commsEle.show();
    commsEle.find('a').removeClass('active');
    return commsEle.siblings('.sub-cond').hide();
  }
};

generateComm = function(id, ele) {
  var commsEle;
  commsEle = $("<div class='sub-cond' id='district" + id + "'></div>");
  if (id != null) {
    api.findPlate(id).success(function(data) {
      var comm, i, len, ref, results;
      data.data.unshift({
        name: '不限'
      });
      ref = data.data;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        comm = ref[i];
        results.push(addComm(commsEle, comm));
      }
      return results;
    });
  }
  ele.append(commsEle);
  return commsEle.siblings('.sub-cond').hide();
};

addComm = function(commsEle, comm) {
  var commEle;
  commEle = $("<a href='#' comm-id='" + (comm.id || '') + "'>" + comm.name + "</a>");
  if ((query.commId != null) && query.commId === comm.id + "") {
    commEle.addClass('active');
  }
  commEle.bind('click', function() {
    commEle.siblings().removeClass('active');
    commEle.addClass('active');
    query.commId = commEle.attr('comm-id');
    if (query.commId == null) {
      delete query.commId;
    }
    return reLoadBuilding();
  });
  return commsEle.append(commEle);
};

reLoadBuilding = function() {
  $('.item').remove();
  query.curPage = 1;
  return loadBuilding();
};

loadBuilding = function() {
  $('.loading').show();
  return api.loadBuilding(query).success(function(data) {
    var building, buildings, buildingsELe, i, len, ref, results;
    buildings = data.data;
    if (buildings.totalCount === 0) {
      $('.loading').hide();
    }
    if (query.curPage < buildings.totalpages) {
      query.curPage++;
      isMore = true;
    } else {
      isMore = false;
    }
    buildingsELe = $('#buildings');
    buildingsELe.find('#number').text(buildings.totalCount);
    ref = buildings.resultList;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      building = ref[i];
      results.push(addBuilding(building, buildingsELe));
    }
    return results;
  });
};

addBuilding = function(building, ele) {
  var buildingEle, i, len, link, ref, unit, unitEle;
  link = "cityId=" + query.cityId + "&buildingId=" + building.buildingId + "\n&maxArea=" + query.maxArea + "&maxPrice=" + query.maxPrice + "&minArea=" + query.minArea + "\n&minPrice=" + query.minPrice;
  buildingEle = $("<div class=\"item\" ><a href=projectDetail.html?" + link + ">\n  <img  src=" + (building.buildingImage || 'img/default_b.png') + "\n  width=200px height=\"150px\"/></a>\n  <div class=\"desc\">\n    <h4><a href=projectDetail.html?" + link + ">" + building.buildingName + "</a></h4>\n    <div>" + building.buildingAddress.slice(0, 17) + "\n    " + (building.buildingAddress.length > 16 ? "..." : "") + "</div>\n<div>租金：</span><span class=\"money\">" + building.averageRent + "元/平.天\n</div>\n    <a href=\"projectDetail.html?" + link + "\">项目详情</a>\n    <a href=\"projectDetail.html?" + link + "#rent\">在租房源</a>\n\n  </div>\n  <div class=\"right\">\n    <ul>\n\n    </ul>\n    <span>\n      " + building.suitableNum + "套房源符合条件\n    </span>\n  </div>\n</div>");
  unitEle = buildingEle.find('.right>ul');
  ref = building.unitList.slice(0, 3);
  for (i = 0, len = ref.length; i < len; i++) {
    unit = ref[i];
    addUnit(unit, unitEle, building.buildingId);
  }
  $('.loading').hide();
  return $('.loading').before(buildingEle);
};

addUnit = function(unit, ele, buildingId) {
  var link, unitEle;
  link = "buildingId=" + buildingId + "&groupId=" + unit.groupId;
  unitEle = $("<a href=floorDetail.html?" + link + ">\n <img src=" + (unit.unitImage || 'img/list-right.png') + "\n height=100px width=160px/><span class=left>" + (unit.unitArea || '') + "平 </span>\n<span class=right>" + (unit.rent || '') + "元/平.天</span></a>");
  return ele.append(unitEle);
};
