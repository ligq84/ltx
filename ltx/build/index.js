var addAreaFindHouse, addPlate, districts, generateDistrictByCityId, generateHotByCityId, goList, goMap, plateListMinHeight, query, setCurrentCity, showPlate, toUrl, urlVars;

query = {};

urlVars = {};

plateListMinHeight = 100;

$(function() {
  var after, circle, i, next;
  urlVars = $.getUrlVars();
  $('#acreage').pullDown(['不限', '100㎡以下', '100-200㎡', '200-300㎡', '300-500㎡', '500-700㎡', '700-1000㎡', '1000-1500㎡', '1500-2000㎡', '2000㎡以上'], {
    onClick: function(e) {
      var data, first, second;
      if ($(e.currentTarget).text() !== "不限") {
        data = $(e.currentTarget).text().split('-');
        if (data[0] != null) {
          first = parseInt(data[0]);
        }
        if (data[1] != null) {
          second = parseInt(data[1]);
        }
        if ((first != null) && (second != null)) {
          query.minArea = first;
          return query.maxArea = second;
        } else if (first === 100) {
          return query.maxArea = 100;
        } else {
          return query.minArea = first;
        }
      }
    }
  });
  $('#rent').pullDown(['不限', '1元/㎡.天以下', '1-2元/㎡.天', '2-3元/㎡.天', '3-4元/㎡.天', '4-5元/㎡.天', '5-6元/㎡.天', '6-7元/㎡.天', '7-8元/㎡.天', '8-9元/㎡.天', '9元/㎡.天以上'], {
    onClick: function(e) {
      var data, first, second;
      if ($(e.currentTarget).text() !== "不限") {
        data = $(e.currentTarget).text().split('-');
        if (data[0] != null) {
          first = parseInt(data[0]);
        }
        if (data[1] != null) {
          second = parseInt(data[1]);
        }
        if ((first != null) && (second != null)) {
          query.minPrice = first;
          return query.maxPrice = second;
        } else if (first === 1) {
          return query.maxPrice = 1;
        } else {
          return query.minPrice = first;
        }
      }
    }
  });
  $('#search').bind('keydown', function(e) {
    if (e.which === 32) {
      return false;
    }
    if (e.which === 13) {
      return goList(e);
    }
  });
  $('#search-btn').bind('click', goList);
  $('#search-map').bind('click', goMap);
  loadCity(urlVars.cityId, function(cityId) {
    setCurrentCity(cityId);
    if (cityId !== "802") {
      $("#telphone").text("400-022-3773");
    } else {
      $("#telphone").text("400-996-5583");
    }
    $("#district>ul.pull-down").remove();
    generateDistrictByCityId(cityId);
    return generateHotByCityId(cityId);
  });
  i = 0;
  circle = null;
  next = function(flag) {
    if (flag === "before") {
      clearTimeout(circle);
      $("ul.banner>li").eq(i).fadeOut(1000);
      i = i - 1 < 0 ? i + 2 : i - 1;
      $("ul.banner>li").eq(i).fadeIn(1000);
      return next();
    } else if (flag === "after") {
      clearTimeout(circle);
      after();
      return next();
    } else {
      return circle = setTimeout(function() {
        after();
        return next();
      }, 4000);
    }
  };
  after = function() {
    $("ul.banner>li").eq(i).fadeOut(1000);
    i = i === 2 ? 0 : i + 1;
    return $("ul.banner>li").eq(i).fadeIn(1000);
  };
  $("img.arrow.right").bind("click", function() {
    return next("after");
  });
  $("img.arrow.left").bind("click", function() {
    return next("before");
  });
  return next();
});

setCurrentCity = function(cityId) {
  var alist;
  alist = $("a.self");
  return alist.each(function(i, ele) {
    var origin;
    origin = alist.eq(i).attr("href").replace(/&cityId\=\d{3}/g, "");
    return alist.eq(i).attr("href", origin + "&cityId=" + cityId);
  });
};

generateHotByCityId = function(cityId) {
  if (cityId === "802") {
    $("#867").hide();
    return $("#802").show();
  } else {
    $("#802").hide();
    return $("#867").show();
  }
};

generateDistrictByCityId = function(cityId) {
  $("#search").autoComplete(cityId);
  query.cityId = cityId;
  return api.findDistrict(cityId).success(function(data) {
    var area, district, j, len, ref;
    ref = data.data.slice(0, 5);
    for (j = 0, len = ref.length; j < len; j++) {
      area = ref[j];
      addAreaFindHouse(area);
    }
    district = $('#district');
    plateListMinHeight = data.data.length * 26;
    return district.pullDown(data.data, {
      onHoverIn: function(e) {
        var li;
        li = $(e.currentTarget);
        return showPlate(li.attr('data-id'), li);
      },
      onClick: function(e) {
        var li;
        li = $(e.currentTarget);
        query.districtId = li.attr('data-id');
        return delete query.commId;
      }
    });
  });
};

addAreaFindHouse = function(area) {
  var a;
  a = $("<a href=listImgs.html?cityId=" + query.cityId + "&districtId=" + area.id + ">\n" + area.name + "\n</a>");
  return $("#moreArea").before(a);
};

districts = [];

showPlate = function(districtId, li) {
  var plates;
  if (li.find("div.plate_list").length === 0) {
    plates = $("<div class='plate_list'></div>");
    plates.css("min-height", plateListMinHeight + 2 + "px");
    li.append(plates);
    return api.findPlate(districtId).success(function(data) {
      var j, len, plate, ref;
      ref = data.data;
      for (j = 0, len = ref.length; j < len; j++) {
        plate = ref[j];
        addPlate(plate, plates);
      }
      return plates.find('a.plate').bind('click', function(e) {
        plate = $(e.currentTarget);
        query.districtId = plate.parent().parent().parent().attr('data-id');
        query.commId = plate.attr('plate-id');
        $('#district>span').text(plate.text());
        return e.stopPropagation();
      });
    });
  }
};

addPlate = function(plate, plates) {
  var last;
  last = plates.find('div:last');
  if (last.find('span').text() === plate.py) {
    return last.append($("<a class=plate plate-id=" + plate.id + ">" + plate.name + "</a>"));
  } else {
    return plates.append($("<div><span>" + plate.py + "</span>\n<a class=\"plate\" plate-id=" + plate.id + ">" + plate.name + "</a></div>"));
  }
};

goList = function(e) {
  e.stopPropagation();
  query.searchName = encodeURI($('#search').val());
  return location.href = "listImgs.html?" + toUrl.call(query);
};

goMap = function(e) {
  e.stopPropagation();
  query.searchName = encodeURI($('#search').val());
  return location.href = "listImgs.html?mode=1&" + toUrl.call(query);
};

toUrl = function() {
  var key;
  return ((function() {
    var j, len, ref, results;
    ref = _.keys(this);
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      key = ref[j];
      results.push(key + "=" + this[key]);
    }
    return results;
  }).call(this)).join("&");
};
