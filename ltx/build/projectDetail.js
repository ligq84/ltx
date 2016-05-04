var addImage, addUnit, entrustQuery, loadBuildingInfo, loadBuildingInfoImage, loadEasyMap, loadImage, loadUnit, query, thenShow, urlVars;

query = {};

entrustQuery = {};

$(window).scroll(function(e) {
  var distance, height, outerHeight, rightHeight, top, total;
  height = $("div.project_desc").offset().top;
  outerHeight = $("div.project_desc").outerHeight();
  rightHeight = $("div.right").outerHeight();
  total = outerHeight + height - rightHeight - 25;
  distance = $(window).scrollTop();
  if ((total > distance && distance > 128)) {
    $("div.right").css("top", distance - 128);
  }
  if (distance < 128) {
    top = parseInt($("div.right").css("top"));
    if (top > 0) {
      $("div.right").css("top", 0);
    }
  }
  if (total < distance) {
    return $("div.right").css("top", total - 128);
  }
});

loadEasyMap = function(x, y, selector, city) {
  var circle, distance, localSearch, map, marker, point;
  map = new BMap.Map(selector);
  point = new BMap.Point(x, y);
  marker = new BMap.Marker(point, {
    enableMassClear: false
  });
  map.centerAndZoom(point, 18);
  map.disableScrollWheelZoom();
  map.addOverlay(marker);
  distance = 245;
  circle = new BMap.Circle(point, distance, {
    fillColor: "#e57a65",
    strokeWeight: 5,
    strokeColor: "#ff7f00",
    fillOpacity: 0.2,
    enableMassClear: false,
    strokeOpacity: 1
  });
  map.addOverlay(circle);
  localSearch = new BMap.LocalSearch(point, {
    onSearchComplete: function(results) {
      switch (results.keyword) {
        case "美食":
          return thenShow(results, "food", map);
        case "银行":
          return thenShow(results, "bank", map);
        case "酒店":
          return thenShow(results, "hotel", map);
        case "公交":
          return thenShow(results, "transit", map);
      }
    },
    pageCapacity: 50
  });
  localSearch.searchNearby("银行", point, distance);
  localSearch.searchNearby("美食", point, distance);
  localSearch.searchNearby("酒店", point, distance);
  return localSearch.searchNearby("公交", point, distance);
};

thenShow = function(results, id, map) {
  var complement, i, item, j, ref, sum, total;
  total = results.getNumPois();
  $("#" + id).find(".num span.total").text(total);
  sum = total > 4 ? 4 : total;
  for (i = j = 0, ref = sum; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    item = results.getPoi(i);
    complement = $("<span class=\"circle\"></span>\n<span  x=" + item.point.lng + " y=" + item.point.lat + ">\n" + item.title + "<span><br>");
    $("#" + id).find("div.content").append(complement);
    complement.hover(function(e) {
      var complementCircle, complementLabel, ele, text, x, y;
      map.clearOverlays();
      ele = $(e.target);
      x = ele.attr("x");
      y = ele.attr("y");
      complementCircle = new BMap.Circle(new BMap.Point(x, y), 12, {
        fillColor: "#e52600",
        strokeColor: "#e52600",
        strokeWeight: 0,
        strokeOpacity: 1,
        fillOpacity: 1
      });
      text = ele.text().replace(/\s/g, "").substr(0, 1);
      complementLabel = new BMap.Label(text, {
        position: new BMap.Point(parseFloat(x) - 0.000055, parseFloat(y) + 0.00005)
      });
      complementLabel.setStyle({
        fontSize: "14px",
        color: '#fff',
        border: "0px",
        padding: "0px"
      });
      map.addOverlay(complementCircle);
      return map.addOverlay(complementLabel);
    });
  }
  return $("div.item#" + id + ">footer").bind('click', function(e) {
    var k, len, marker, ref1, result, results1;
    $("div.item>footer").removeClass("active");
    $(e.target).addClass('active');
    map.clearOverlays();
    ref1 = results.tr;
    results1 = [];
    for (k = 0, len = ref1.length; k < len; k++) {
      result = ref1[k];
      marker = new BMap.Marker(result.point);
      results1.push(map.addOverlay(marker));
    }
    return results1;
  });
};

urlVars = {};

$(document).ready(function() {
  urlVars = $.getUrlVars();
  if (urlVars.cityId !== "802") {
    $("#telphone").text("400-022-3773");
  } else {
    $("#telphone").text("400-996-5583");
  }
  query = urlVars;
  $("div.close").bind('click', function() {
    $(document.documentElement).css("overflow", "auto");
    return $('div.appointment-online').css("display", "none");
  });
  $('.right>.add').bind('click', function() {
    $(window).scrollTop(0);
    $(document.documentElement).css("overflow", "hidden");
    return $("div.appointment-online").css("display", "block");
  });
  entrustQuery.cityId = urlVars.cityId;
  $('div.appointment-online div.sure').bind('click', function(e) {
    if ((entrustQuery.tel != null) && /^\S/.test(entrustQuery.tel)) {
      return api.entrustAdd(entrustQuery, 1).then(function(data) {
        $('div.appointment-online').css("display", "none");
        return $(document.documentElement).css("overflow", "auto");
      });
    } else {
      return $('div.error').text("请输入手机号/座机");
    }
  });
  $("div.appointment-online input").bind('blur', function(e) {
    return entrustQuery[$(e.target).attr("name")] = e.target.value.replace(/\s/g, "");
  });
  query.curPage = 1;
  showLocation(query);
  loadBuildingInfo(query.buildingId);
  loadBuildingInfoImage(query.buildingId);
  loadUnit(query);
  loadImage(query.buildingId);
  $(".listSearch>a#datuMode").attr("href", "listImgs.html?cityId=" + query.cityId);
  $(".listSearch>a#dituMode").attr("href", "listImgs.html?mode=1&cityId=" + query.cityId);
  $('#rent .more').bind('click', function() {
    query.curPage++;
    return loadUnit(query);
  });
  return setTimeout(function() {
    return $('.project').stickUp({
      parts: {
        0: 'info',
        1: 'rent',
        2: 'para',
        3: 'disc',
        4: 'around'
      },
      itemClass: 'menuItem',
      itemHover: 'active'
    });
  });
});

loadImage = function(buildingId) {
  return api.loadBuildingImage(buildingId).success(function(data) {
    return addImages(data.data);
  });
};

loadBuildingInfo = function(buildingId) {
  return api.loadBuildingInfo(buildingId).success(function(data) {
    var b, bEle, building, end, j, len, p, ref, title;
    building = data.data;
    if (!(urlVars.cityId != null)) {
      urlVars.cityId = building.cityId;
      entrustQuery.cityId = urlVars.cityId;
      if (urlVars.cityId !== "802") {
        $("#telphone").text("400-022-3773");
        $("#location").text("苏州");
      } else {
        $("#telphone").text("400-996-5583");
        $("#location").text("上海");
      }
    }
    entrustQuery.buildingName = building.fullName;
    title = $.toTitle(building.cityName, building.districtName, building.commName, building.fullName);
    $(document).attr('title', title);
    $('#fullName').text(building.fullName);
    $('#address').text(building.address);
    loadEasyMap(building.xPoint, building.yPoint, "projectMap", building.cityName);
    ref = _.keys(building);
    for (j = 0, len = ref.length; j < len; j++) {
      b = ref[j];
      bEle = $('#' + b);
      if (bEle.length === 1) {
        if (b === "description") {
          bEle.html(building[b]);
        } else {
          bEle.text(building[b]);
        }
        if (b === "contactMobile") {
          $("#contactMobile").remove;
        }
      }
    }
    p = $(".project_desc");
    end = p.offset().top - 187;
    return fixedRight(100, end, 120);
  });
};

loadBuildingInfoImage = function(buildingId) {
  return api.loadBuildingImage(buildingId).success(function(data) {
    var image, images, j, len, results1;
    images = data.data;
    if (images[0] != null) {
      $('.project_slider>.img>img').attr('src', images.shift().path);
      results1 = [];
      for (j = 0, len = images.length; j < len; j++) {
        image = images[j];
        results1.push(addImage(image, $('.project_slider>.imgs>ul.main')));
      }
      return results1;
    }
  });
};

addImage = function(image, ele) {
  var imageEle;
  imageEle = $("<li><img src=" + image.path + " width='85px'></img></li>");
  return ele.append(imageEle);
};

loadUnit = function(query) {
  return api.loadUnit(query).success(function(data) {
    var j, len, ref, unit;
    ref = data.data.resultList;
    for (j = 0, len = ref.length; j < len; j++) {
      unit = ref[j];
      addUnit(unit, query);
    }
    if (data.data.totalCount <= 8 * query.curPage) {
      return $('#rent .more').remove();
    }
  });
};

addUnit = function(unit, query) {
  var unitEle;
  unitEle = $("<li data-id=" + unit.groupId + ">\n  <span>" + (unit.unitArea || "") + "m<sup>2</sup></span>\n  <span>" + (unit.rent || "") + "元/m<sup>2</sup>.天</span></span>\n  <span class=\"img\">\n    <img\n      width=\"80px\"\n      height=\"60px\" src=" + (unit.unitImage || 'img/default_bb.png') + " />\n  </span>\n</li>");
  unitEle.bind('click', function(e) {
    return $("div.show_imgs").showBuildingImgs($(e.currentTarget).attr("data-id"));
  });
  return $('div.project_rent ul.rent').append(unitEle);
};
