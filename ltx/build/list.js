var addBuilding, addComm, addDistrict, addUnit, currentRequest, generateComm, generateDistrictByCityId, isMore, loadBuilding, loadOnce, maxNum, onScroll2Bottom, query, reLoadBuilding, showComm, urlVars;

query = {
  curPage: 1,
  pageSize: 8
};

urlVars = {};

isMore = false;

maxNum = 3;

currentRequest = null;

loadOnce = 0;

$(function() {
  var flag;
  urlVars = $.getUrlVars();
  _.extend(query, urlVars);
  query.minArea = query.minArea || 0;
  query.maxArea = query.maxArea || 2000;
  query.minPrice = query.minPrice || 0;
  query.maxPrice = query.maxPrice || 9;
  $(".top>input").autoComplete(query.cityId);
  $(".top>input").bind('input propertychange', function(e) {
    return query.searchName = $(e.target).val();
  });
  flag = 1;
  loadCity(urlVars.cityId, function(cityId) {
    $("div.sub-cond>div").remove();
    generateDistrictByCityId(cityId);
    query.curPage = 1;
    if (flag > 1) {
      delete query.districtId;
      delete query.commId;
      setTimeout(function() {
        $("#district>a[district-id]").eq(0).click();
        return setTimeout(function() {
          return reLoadBuilding(function() {
            return loadOnce = 0;
          });
        }, 100);
      }, 100);
    } else {
      maxNum = parseInt(($("#buildings").innerWidth() - 722) / 180);
      query.showNum = maxNum;
      loadBuilding().done(function() {
        return onScroll2Bottom();
      });
    }
    return flag++;
  });
  maxNum = parseInt(($("#buildings").innerWidth() - 722) / 180);
  query.showNum = maxNum;
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
    max: query.maxArea || 2000,
    onEnd: function(n) {
      query.minArea = this.min;
      query.maxArea = this.max;
      return reLoadBuilding();
    }
  });
  return $('#priceBox').slipping({
    unit: 9,
    postfix: '',
    min: query.minPrice,
    max: query.maxPrice || 9,
    onEnd: function() {
      query.minPrice = this.min;
      query.maxPrice = this.max;
      return reLoadBuilding();
    }
  });
});

onScroll2Bottom = function() {
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
    $(".top>input").val("");
    query.searchName = "";
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
    if (id !== "") {
      commsEle.show();
    }
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
  commsEle.siblings('.sub-cond').hide();
  if (id === "") {
    return commsEle.hide();
  }
};

addComm = function(commsEle, comm) {
  var commEle;
  commEle = $("<a href='#' comm-id='" + (comm.id || '') + "'>" + comm.name + "</a>");
  if ((query.commId != null) && query.commId === comm.id + "") {
    commEle.addClass('active');
  }
  commEle.bind('click', function() {
    $(".top>input").val("");
    query.searchName = "";
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

reLoadBuilding = function(callback) {
  $('.item').remove();
  query.curPage = 1;
  if (callback != null) {
    return loadBuilding().done(callback);
  } else {
    return loadBuilding();
  }
};

loadBuilding = function() {
  var condition, request;
  $('.loading').show();
  $("#location").text($('#city>span').text());
  condition = _.clone(query);
  if (condition.maxArea === 2000 || condition.maxArea === "不限") {
    delete condition.maxArea;
  }
  if (condition.maxPrice === 9 || condition.maxPrice === "不限") {
    delete condition.maxPrice;
  }
  if (currentRequest != null) {
    currentRequest.abort();
  }
  request = api.loadBuilding(condition).success(function(data) {
    var building, buildings, buildingsELe, i, left, len, ref;
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
    for (i = 0, len = ref.length; i < len; i++) {
      building = ref[i];
      addBuilding(building, buildingsELe);
    }
    left = ($(window).width() - 320 - (query.showNum * 175 + 210 + 200)) / 2 + 20;
    $(".top").css("width", query.showNum * 175 + 210 + 205);
    $(".item").css("width", query.showNum * 175 + 210 + 205);
    return $("#buildings").css("padding-left", left + "px");
  });
  return currentRequest = request;
};

addBuilding = function(building, ele) {
  var address, buildingEle, centre, i, left, len, link, p, price, project, q, ref, rent, right, title, u, unitEle;
  q = _.clone(query);
  if (q.maxArea === 2000) {
    q.maxArea = "";
  }
  if (q.maxPrice === 9) {
    q.maxPrice = "";
  }
  link = "cityId=" + q.cityId + "&buildingId=" + building.buildingId;
  link = link + ("&maxArea=" + q.maxArea + "&maxPrice=" + q.maxPrice);
  link = link + ("&minArea=" + q.minArea + "&minPrice=" + q.minPrice);
  buildingEle = $("<div class=\"item\"></div>");
  left = $("<a target=\"_blank\"  href=projectDetail.html?" + link + ">\n  <img  src=" + (building.buildingImage || 'img/default_b.png') + "\n  width=200px height=\"150px\"/></img>\n</a>");
  centre = $("<div class=\"desc\">\n</div>");
  title = $("<h4>\n<a target=\"_blank\" href=projectDetail.html?" + link + ">" + building.buildingName + "</a>\n</h4>");
  address = $("  <div>\n    " + building.buildingAddress.slice(0, 17) + "\n    " + (building.buildingAddress.length > 16 ? "..." : "") + "\n</div>");
  p = building.averageRent + "元/m<sup>2</sup>.天";
  price = $("<div>租金:<span class=\"money\"></span>\n\n</div>");
  project = $("<a target=\"_blank\"  href=\"projectDetail.html?" + link + "\">项目详情</a>");
  rent = $("<a  target=\"_blank\" href=\"projectDetail.html?" + link + "#rent\">在租房源</a>");
  price.find(".money").html(p);
  centre.append(title).append(address).append(price).append(project).append(rent);
  right = $("<div class=\"right\">\n  <ul>\n  </ul>\n  <a target=\"_blank\" href=\"projectDetail.html?" + link + "#rent\">\n    " + building.suitableNum + "套房源符合条件\n  </a>\n</div>");
  buildingEle.append(left).append(centre).append(right);
  unitEle = buildingEle.find('.right>ul');
  ref = building.unitList.slice(0, +maxNum + 1 || 9e9);
  for (i = 0, len = ref.length; i < len; i++) {
    u = ref[i];
    addUnit(u, unitEle, building.buildingId);
  }
  $('.loading').hide();
  return $('.loading').before(buildingEle);
};

addUnit = function(unit, ele, buildingId) {
  var link, unitEle;
  link = "buildingId=" + buildingId + "&groupId=" + unit.groupId + "&cityId=" + query.cityId;
  unitEle = $("<a target=\"_blank\" href=floorDetail.html?" + link + ">\n <img src=" + (unit.unitImage || 'img/default85.png') + "\n height=100px width=160px/></img>\n <span class=left>" + (unit.unitArea || '') + "m<sup>2</sup>\n </span>\n<span class=right>" + (unit.rent || '') + "元/m<sup>2</sup>.天</span></a>");
  return ele.append(unitEle);
};
