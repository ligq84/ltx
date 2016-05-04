var addSource, addUnit, condition, initAreas, length, load, loadBuildingInfo, loadUnit, loadUnitInfo, query, units, urlVars;

query = {};

urlVars = {};

units = [];

condition = {};

length = 0;

$(document).ready(function() {
  urlVars = $.getUrlVars();
  query = urlVars;
  loadUnit(query);
  loadUnitInfo(query.groupId);
  initAreas(query.buildingId);
  showLocation(query);
  loadBuildingInfo(query.buildingId);
  $(".listSearch>a").attr("href", "list.html?cityId=" + query.cityId);
  $('.detail_fixed').pin();
  $(".last").bind("click", function(e) {
    query.minArea = $("#start").val();
    query.maxArea = $("#end").val();
    return loadUnit(query);
  });
  api.getBuildingUnitArea(query.buildingId).success(function(data) {
    var area, areaList, results;
    areaList = data.data[0];
    areaList.areaAll = "1";
    results = [];
    for (area in areaList) {
      if (areaList[area] !== "0") {
        $("#" + area).addClass("have");
        $("#" + area).attr("have", "true");
        results.push($("#" + area).bind("click", function(e) {
          query.minArea = $(e.target).attr("s");
          query.maxArea = $(e.target).attr("e");
          return loadUnit(query);
        }));
      } else {
        results.push(void 0);
      }
    }
    return results;
  });
  $('#right').bind('click', function() {
    if (condition.curPage * 8 < length) {
      condition.curPage++;
      load();
    }
    if (condition.curPage > 1) {
      return $('#left').attr("src", "img/left_active.png");
    } else {
      return $('#left').attr("src", "img/left.png");
    }
  });
  return $('#left').bind('click', function() {
    if (condition.curPage > 1) {
      condition.curPage--;
      load();
    }
    if (condition.curPage > 1) {
      return $('#left').attr("src", "img/left_active.png");
    } else {
      return $('#left').attr("src", "img/left.png");
    }
  });
});

initAreas = function(buildingId) {
  var a;
  a = $('.detail_search>a');
  return a.each(function(i, e) {
    return a.eq(i).attr('href', a.eq(i).attr('href') + "&buildingId=" + buildingId);
  });
};

addSource = function(source) {
  var sourceEle;
  sourceEle = $("<div>\n<span clsss=\"acreage\">\n" + source.unitArea + "m<sup>2</sup>\n</span>\n  <span clsss=\"orientation\">\n  " + source.orientation + "\n  </span>\n</div>");
  return $(".detail_plan_main").append(sourceEle);
};

loadUnitInfo = function(groupId) {
  return api.loadUnitInfo(groupId).success(function(data) {
    var b, bEle, floor, imagePath, images, j, k, l, len, len1, len2, ref, ref1, ref2, source, title;
    floor = data.data;
    title = $.toTitle(floor.cityName || "", floor.districtName || "", floor.commName || "", floor.buildingName);
    $(document).attr('title', title);
    console.log(floor);
    if (floor.rentStatus !== 1) {
      $("a.add").text("已租");
    }
    $(".detail_plan_main>div").remove();
    ref = floor.buildingList;
    for (j = 0, len = ref.length; j < len; j++) {
      source = ref[j];
      addSource(source);
    }
    if ((floor.floorPath != null) && (floor.floorPath + "").indexOf("null") === -1) {
      $(".detail_plan_main>img").show();
      $(".detail_plan_main>img").attr("src", floor.floorPath || "");
    } else {
      $(".detail_plan_main>img").hide();
    }
    images = [];
    ref1 = floor.imageList;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      imagePath = ref1[k];
      images.push({
        path: imagePath
      });
    }
    addImages(images);
    ref2 = _.keys(floor);
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      b = ref2[l];
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
  condition = _.clone(query);
  condition.curPage = 1;
  return load();
};

load = function() {
  return api.loadUnit(condition).success(function(data) {
    var i, j, len, unit;
    units = data.data.resultList;
    length = data.data.totalCount;
    $('.detail_option>div').remove();
    for (i = j = 0, len = units.length; j < len; i = ++j) {
      unit = units[i];
      addUnit(unit, i);
    }
    if (condition.curPage * 8 >= length) {
      return $('#right').attr("src", "img/right.png");
    } else {
      return $('#right').attr("src", "img/right_active.png");
    }
  });
};

addUnit = function(unit, index) {
  var unitEle;
  unitEle = $("<div  index=" + index + " group-id=" + unit.groupId + ">\n<p>" + (unit.unitArea || '') + "m<sup>2</sup></p>\n<p>" + (unit.rent || '') + "元/m<sup>2</sup>.天</p></div>");
  if (unit.groupId + "" === query.groupId) {
    unitEle.addClass('active');
  }
  $('div.detail_option').append(unitEle);
  return unitEle.bind('click', function(e) {
    var ele, groupId;
    ele = $(e.currentTarget);
    groupId = ele.attr('group-id');
    ele.siblings().removeClass('active');
    $(".middle>.imgs>img").remove();
    ele.addClass('active');
    query.groupId = groupId;
    return loadUnitInfo(groupId);
  });
};
