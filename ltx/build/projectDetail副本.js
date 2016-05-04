var addImage, addUnit, loadBuildingInfo, loadBuildingInfoImage, loadUnit, query, urlVars;

query = {};

urlVars = {};

$(document).ready(function() {
  urlVars = $.getUrlVars();
  query = urlVars;
  loadBuildingInfo(query.buildingId);
  loadBuildingInfoImage(query.buildingId);
  loadUnit(query);
  addImages();
  $('#rent .more').bind('click', function() {
    return loadUnit(query);
  });
  setTimeout(function() {});
  return $(document).scroll(function() {
    var scrollTop;
    scrollTop = $(document).scrollTop();
    if (scrollTop > 140 && scrollTop < 860) {
      return $(".detail_fr").css('top', scrollTop - 140 + 'px');
    } else if (scrollTop > 860) {
      return $(".detail_fr").css('top', '720px');
    } else {
      return $(".detail_fr").css('top', '20px');
    }
  });
});

loadBuildingInfo = function(buildingId) {
  return api.loadBuildingInfo(buildingId).success(function(data) {
    var b, bEle, building, i, len, ref, results;
    building = data.data;
    console.log(building);
    $('#fullName').text(building.fullName);
    $('#address').text(building.address);
    loadEasyMap(building.xPoint, building.yPoint, "projectMap", building.cityName);
    ref = _.keys(building);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      b = ref[i];
      bEle = $('#' + b);
      if (bEle.length === 1) {
        if (b === "description") {
          results.push(bEle.html(building[b]));
        } else {
          results.push(bEle.text(building[b]));
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  });
};

loadBuildingInfoImage = function(buildingId) {
  return api.loadBuildingImage(buildingId).success(function(data) {
    var i, image, images, len, results;
    images = data.data;
    if (images[0] != null) {
      $('.project_slider>.img>img').attr('src', images.shift().path);
      results = [];
      for (i = 0, len = images.length; i < len; i++) {
        image = images[i];
        results.push(addImage(image, $('.project_slider>.imgs>ul.main')));
      }
      return results;
    }
  });
};

addImage = function(image, ele) {
  var imageEle;
  imageEle = $("<li><img src=" + image.path + " width='85px'></li>");
  return ele.append(imageEle);
};

loadUnit = function(query) {
  console.log(query);
  return api.loadUnit(query).success(function(data) {
    var i, len, ref, unit;
    console.log(data);
    ref = data.data;
    for (i = 0, len = ref.length; i < len; i++) {
      unit = ref[i];
      addUnit(unit, query);
    }
    if (data.data.length < 8) {
      return $('#rent .more').remove();
    }
  });
};

addUnit = function(unit, query) {
  var unitEle;
  console.log(unit);
  unitEle = $("<li>\n<a href=floorDetail.html?" + (toUrl.call(query)) + "&groupId=" + unit.groupId + ">\n             <img src=" + (unit.unitImage || 'img/default_b.png') + "\n              width=200px height=150px></a>\n<div>" + (unit.unitArea || "") + "平\n            <span class=\"\">" + (unit.rent || "") + "元/平.天</span></div></li>");
  return $('div.project_rent ul.rent').append(unitEle);
};
