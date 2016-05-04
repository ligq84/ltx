var addUnit, initAreas, loadBuildingInfo, loadUnit, loadUnitInfo, query, urlVars;

query = {};

urlVars = {};

$(document).ready(function() {
  urlVars = $.getUrlVars();
  query = urlVars;
  loadUnit(query);
  loadUnitInfo(query.groupId);
  return initAreas(query.buildingId);
});

initAreas = function(buildingId) {
  var a;
  a = $('.detail_search>a');
  return a.each(function(i, e) {
    return a.eq(i).attr('href', a.eq(i).attr('href') + "&buildingId=" + buildingId);
  });
};

loadUnitInfo = function(groupId) {
  return api.loadUnitInfo(groupId).success(function(data) {
    var b, bEle, floor, j, len, ref;
    floor = data.data;
    addImages(floor.imageList);
    ref = _.keys(floor);
    for (j = 0, len = ref.length; j < len; j++) {
      b = ref[j];
      bEle = $('#' + b);
      if (bEle.length === 1) {
        bEle.html(floor[b]);
      }
    }
    return loadEasyMap(floor.xPoint, floor.yPoint, "floorMap");
  });
};

loadBuildingInfo = function(buildingId) {
  return api.loadBuildingInfo(buildingId).success(function(data) {
    var building;
    building = data.data;
    if (building.description != null) {
      return $('#description').html(building.description);
    } else {
      return $('.detail_desc').remove();
    }
  });
};

loadUnit = function(query) {
  return api.loadUnit(query).success(function(data) {
    var i, j, len, results, unit, units;
    units = data.data;
    if (units.length <= 8) {
      $('div.detail_option>img').hide();
    }
    results = [];
    for (i = j = 0, len = units.length; j < len; i = ++j) {
      unit = units[i];
      results.push(addUnit(unit, i));
    }
    return results;
  });
};

addUnit = function(unit, i) {
  var unitEle;
  console.log(i);
  unitEle = $("<div group-id=" + unit.groupId + "><p>" + (unit.unitArea || '') + "平</p>\n<p>" + (unit.rent || '') + "元/平.天</p></div>");
  if (i === 0) {
    unitEle.css('margin-left', '0px');
  }
  if (unit.groupId + "" === query.groupId) {
    unitEle.addClass('active');
  }
  $('div.detail_option').append(unitEle);
  return unitEle.bind('click', function(e) {
    var ele, groupId;
    ele = $(e.currentTarget);
    groupId = ele.attr('group-id');
    ele.siblings().removeClass('active');
    ele.addClass('active');
    query.groupId = groupId;
    return loadUnitInfo(groupId);
  });
};
