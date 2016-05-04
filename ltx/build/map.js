var Area, District, addMapFloorEle, currentCity, districts, loadMap, onFloorClick, query, urlVars,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

urlVars = {};

query = {};

currentCity = {
  name: "上海",
  districtOverlays: [],
  areaOverlays: [],
  floorOverlays: []
};

BMap.Map.prototype.getXY = function() {
  var map;
  map = this;
  return {
    maxx: map.getBounds().getNorthEast().lng,
    maxy: map.getBounds().getNorthEast().lat,
    minx: map.getBounds().getSouthWest().lng,
    miny: map.getBounds().getSouthWest().lat
  };
};

location['上海'] = {
  x: 121.48,
  y: 31.22
};

location['苏州'] = {
  x: 120,
  y: 31
};

districts = [];

$(function() {
  urlVars = $.getUrlVars();
  _.extend(query, urlVars);
  return loadCity(urlVars.cityId, function(cityId) {
    var cityName;
    cityName = $("#city>span").text();
    return api.findDistrictState(cityId).done(function(data) {
      return loadMap(cityName, data);
    });
  });
});

District = (function(superClass) {
  extend(District, superClass);

  District.prototype.style = {
    color: '#fff',
    textAlign: 'right',
    backgroundColor: 'transparent',
    border: '0px',
    fontWeight: 600
  };

  function District(name, x, y, groupNum, map1, zoom1) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.groupNum = groupNum;
    this.map = map1;
    this.zoom = zoom1 != null ? zoom1 : 12;
    this.basicZoom = 12;
    District.__super__.constructor.call(this);
  }

  return District;

})(Block);

Area = (function(superClass) {
  extend(Area, superClass);

  Area.prototype.style = {
    color: '#fff',
    textAlign: 'right',
    backgroundColor: 'transparent',
    border: '0px',
    fontWeight: 600
  };

  function Area(name, x, y, groupNum, map1, zoom1) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.groupNum = groupNum;
    this.map = map1;
    this.zoom = zoom1 != null ? zoom1 : 14;
    Area.__super__.constructor.call(this);
  }

  return Area;

})(Block);

loadMap = function(city, ds) {
  var addFloorOverlay, d, district, i, len, map, results;
  map = new BMap.Map("mainMap");
  map.enableScrollWheelZoom(false);
  map.centerAndZoom(new BMap.Point(location[city].x, location[city].y), 12.8);
  map.setCurrentCity(city);
  map.addEventListener("zoomend", function() {
    var area, district, i, j, k, l, len, len1, len2, len3, len4, m, ref, ref1, ref2, ref3, ref4, results, results1, zoom;
    zoom = this.getZoom();
    if (zoom < 14) {
      map.clearOverlays();
      ref = currentCity.areaOverlays;
      for (i = 0, len = ref.length; i < len; i++) {
        area = ref[i];
        area.hide();
      }
      ref1 = currentCity.districtOverlays;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        district = ref1[j];
        results.push(district.resetZoom(zoom));
      }
      return results;
    } else if ((16 > zoom && zoom > 13)) {
      map.clearOverlays();
      ref2 = currentCity.districtOverlays;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        district = ref2[k];
        district.hide();
      }
      ref3 = currentCity.areaOverlays;
      results1 = [];
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        area = ref3[l];
        results1.push(area.resetZoom(zoom));
      }
      return results1;
    } else if (zoom > 15) {
      ref4 = currentCity.areaOverlays;
      for (m = 0, len4 = ref4.length; m < len4; m++) {
        area = ref4[m];
        area.hide();
      }
      return api.findfloorByScreen(map.getXY()).success(function(data) {
        var floor, len5, n, results2;
        results2 = [];
        for (n = 0, len5 = data.length; n < len5; n++) {
          floor = data[n];
          results2.push(addFloorOverlay(floor, map));
        }
        return results2;
      });
    }
  });
  addFloorOverlay = function(floor, map) {
    var exists, f, label, point;
    exists = (function() {
      var i, len, ref, results;
      ref = currentCity.floorOverlays;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        if (f.id === floor.id) {
          results.push(f);
        }
      }
      return results;
    })();
    if (exists.length === 0) {
      point = new BMap.Point(floor.x, floor.y);
      label = new BMap.Label(floor.name);
      label.id = floor.id;
      label.setStyle({
        backgroundColor: "#c83000",
        color: "#fff",
        border: "0px",
        width: "auto",
        padding: "0px"
      });
      label.setContent("<p class=\"point3\" data-id=" + floor.id + ">\n<i class=\"num micon-map\">" + floor.num + "套\n</i>\n<i class=\"name\">" + floor.name + "\n</i>\n<i class=\"arrow\"></i>\n</p>");
      label.setPosition(point);
      currentCity.floorOverlays.push(label);
      map.addOverlay(label);
      return label.addEventListener("click", onFloorClick);
    } else {
      return map.addOverlay(exists[0]);
    }
  };
  map.addEventListener("moveend", function() {
    if (map.getZoom() > 15) {
      return api.findfloorByScreen(map.getXY()).success(function(data) {
        var floor, i, len, results;
        results = [];
        for (i = 0, len = data.length; i < len; i++) {
          floor = data[i];
          results.push(addFloorOverlay(floor, map));
        }
        return results;
      });
    }
  });
  results = [];
  for (i = 0, len = ds.length; i < len; i++) {
    d = ds[i];
    district = new District(d.name, parseFloat(d.xPoint), parseFloat(d.yPoint), d.groupNum, map, map.getZoom());
    district.resetZoom(map.getZoom());
    currentCity.districtOverlays.push(district);
    if (d.id != null) {
      results.push(api.findAreaStateByDistricId(d.id).success(function(data) {
        var a, area, j, len1, ref, results1;
        ref = data.data;
        results1 = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          a = ref[j];
          if ((a.bdPoint != null) && a.bdPoint.length > 0) {
            area = new Area(a.name, parseFloat(a.xPoint), parseFloat(a.yPoint), a.groupNum, map, map.getZoom());
            results1.push(currentCity.areaOverlays.push(area));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

onFloorClick = function(e) {
  var id, p, projectDetail, target;
  target = e.target;
  id = target.id;
  p = $("p[data-id=" + id + "]");
  projectDetail = $("<div class=\"map_project_detail\">\n<img class=\"arrow\" src=\"img/sanjiao.png\">\n</div>");
  api.findMapBuild(id).success(function(data) {
    var floor, floorEles, floors, i, img, len, moreEles, ref;
    floors = data.data;
    console.log(floors);
    img = $("<div class=\"top-img\">\n  <img src=\"" + floors[0].bpath + "\" width=\"162px\" ></img>\n  <label>" + floors[0].bname + "<label>\n</div>");
    floorEles = $("<ul></ul>");
    moreEles = $("<div>\n<a href=\"projectDetail.html?projectDetail.html?buildingId=" + id + "\">\n查看更多<a>\n</div>");
    ref = floors.slice(0, 3);
    for (i = 0, len = ref.length; i < len; i++) {
      floor = ref[i];
      addMapFloorEle(floor, floorEles);
    }
    if (floors.length > 3) {
      floorEles.append(moreEles);
    }
    projectDetail.append(img);
    projectDetail.append(floorEles);
    return projectDetail.find("label>i").bind("click", function() {
      currentCity.project.remove();
      return delete currentCity.project;
    });
  });
  if (currentCity.project != null) {
    currentCity.project.remove();
    delete currentCity.project;
  }
  currentCity.project = projectDetail;
  return p.append(projectDetail);
};

addMapFloorEle = function(floor, floorEles) {
  var floorEle;
  console.log(floor);
  floorEle = $("<li><span class=\"area\">" + floor.unitArea + "m<sup>2</sup></span>\n<span>" + (floor.rentPrice || "") + "元/月</span>\n<span style=\"float:right\"><a href=\"\">详细信息</a></span></li>");
  return floorEles.append(floorEle);
};
