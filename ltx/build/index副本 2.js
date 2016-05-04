var addAreaFindHouse, addPlate, districts, generateDistrictByCityId, goList, query, showPlate, toUrl, urlVars;

query = {};

urlVars = {};

$(function() {
  urlVars = $.getUrlVars();
  $('#acreage').pullDown(['100平以下', '100-200平', '200-300平', '300-500平', '500-800平'], {
    onClick: function(e) {
      var data, first, second;
      data = e.currentTarget.innerText.split('-');
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
  });
  $('#rent').pullDown(['1元/平.天', '1-2元/平.天', '2-3元/平.天', '3-5元/平.天', '5-8元/平.天'], {
    onClick: function(e) {
      var data, first, second;
      data = e.currentTarget.innerText.split('-');
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
        return query.minPrice = 1;
      }
    }
  });
  $('#search').bind('keydown', function(e) {
    if (e.which === 13) {
      return goList(e);
    }
  });
  $('#search-btn').bind('click', goList);
  return loadCity(urlVars.cityId, function(cityId) {
    return generateDistrictByCityId(cityId);
  });
});

generateDistrictByCityId = function(cityId) {
  query.cityId = cityId;
  return api.findDistrict(cityId).success(function(data) {
    var area, district, i, len, ref;
    ref = data.data;
    for (i = 0, len = ref.length; i < len; i++) {
      area = ref[i];
      addAreaFindHouse(area);
    }
    district = $('#district');
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
  a = $("<a href=list.html?cityId=" + query.cityId + "&districtId=" + area.id + ">\n" + area.name + "\n</a>");
  return $("#areaFindHouse").append(a);
};

districts = [];

showPlate = function(districtId, li) {
  var plates;
  if (li.find("div.plate_list").length === 0) {
    plates = $("<div class='plate_list'></div>");
    li.append(plates);
    return api.findPlate(districtId).success(function(data) {
      var i, len, plate, ref;
      ref = data.data;
      for (i = 0, len = ref.length; i < len; i++) {
        plate = ref[i];
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
  console.log(query);
  return location.href = "list.html?" + toUrl.call(query);
};

toUrl = function() {
  var key;
  return ((function() {
    var i, len, ref, results;
    ref = _.keys(this);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      results.push(key + "=" + this[key]);
    }
    return results;
  }).call(this)).join("&");
};

if (!document.addEventListener) {
  $('nav').css("background", "rgb(204,228,244)");
}
