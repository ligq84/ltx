var addDistrictBoundary, addDistrictCircle, loadMap, query, urlVars;

urlVars = {};

query = {};

location['上海'] = {
  x: 121.48,
  y: 31.22
};

location['苏州'] = {
  x: 120,
  y: 31
};

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

loadMap = function(city, districts) {
  var district, i, len, map;
  map = new BMap.Map("mainMap");
  map.enableScrollWheelZoom();
  map.centerAndZoom(new BMap.Point(location[city].x, location[city].y), 12.8);
  map.setCurrentCity(city);
  for (i = 0, len = districts.length; i < len; i++) {
    district = districts[i];
    addDistrictCircle.call(map, district);
  }
  console.log(districts);
  return map.addEventListener("zoomend", function() {
    return console.log(this.getZoom());
  });
};

addDistrictBoundary = function(district) {
  var bdary;
  bdary = new BMap.Boundary();
  return bdary.get(district.name, function(rs) {
    return district.boundaries = rs.boundaries;
  });
};

addDistrictCircle = function(district) {
  var bottomLabel, bottomLabelPoint, circle, point, style, topLabel, topLabelPoint;
  addDistrictBoundary(district);
  point = new BMap.Point(district.xPoint, district.yPoint);
  topLabelPoint = new BMap.Point(district.xPoint - 0.014, district.yPoint + 0.007);
  bottomLabelPoint = new BMap.Point(district.xPoint - 0.01, district.yPoint);
  circle = new BMap.Circle(point);
  circle.district = district;
  circle.setRadius(2000);
  circle.setStrokeWeight(1);
  circle.getStrokeOpacity(0.1);
  circle.setStrokeColor('#00a282');
  circle.setFillColor('#00a282');
  topLabel = new BMap.Label(district.name, {
    position: topLabelPoint
  });
  bottomLabel = new BMap.Label(district.groupNum + '套', {
    position: bottomLabelPoint
  });
  style = {
    color: '#fff',
    textAlign: 'right',
    backgroundColor: 'transparent',
    border: '0px',
    fontWeight: 600
  };
  topLabel.setStyle(style);
  bottomLabel.setStyle(style);
  circle.disableMassClear();
  topLabel.disableMassClear();
  bottomLabel.disableMassClear();
  this.addOverlay(circle);
  this.addOverlay(topLabel);
  this.addOverlay(bottomLabel);
  circle.addEventListener('mouseover', (function(_this) {
    return function(e) {
      if (district.boundaries[0] != null) {
        _this.showDistrict(e.target.district);
      }
      e.target.setFillColor('#c80000');
      return e.target.setStrokeColor('#c80000');
    };
  })(this));
  circle.addEventListener('mouseout', (function(_this) {
    return function(e) {
      e.target.setFillColor('#00a282');
      e.target.setStrokeColor('#00a282');
      return _this.clearOverlays();
    };
  })(this));
  return this.showDistrict = function(district) {
    var ply;
    ply = new BMap.Polygon(district.boundaries[0], {
      strokeWeight: 2,
      strokeColor: "#ff0000"
    });
    ply.setFillOpacity(0.2);
    ply.setStrokeOpacity(0.7);
    ply.setStrokeColor("#c80000");
    ply.setStrokeWeight(4);
    return this.addOverlay(ply);
  };
};
