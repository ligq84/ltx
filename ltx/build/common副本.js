var addCoordinate, addImages, api, downActive, downUnActive, host, loadCity, loadEasyMap, showCity, toUrl, upActive, upUnActive;

host = 'api';

$.fn.extend({
  pullDown: function(items, callback) {
    var addLi, i, item, len, results, ul;
    this.remove('ul.pull-down');
    ul = $("<ul class='pull-down'></ul>");
    this.append(ul);
    ul.css('width', this.css('width'));
    addLi = (function(_this) {
      return function(item) {
        var hoverIn, hoverOut, li;
        if (_.isString(item)) {
          li = $("<li data-name=" + item + "><a>" + item + "</a></li>");
        } else {
          li = $("<li><a>" + item.name + "</a></li>");
          li.attr('data-name', item.name);
          li.attr('data-id', item.id);
        }
        ul.append(li);
        li.bind('click', function(e) {
          _this.children('span').text(li.attr('data-name'));
          if ((callback != null) && (callback.onClick != null)) {
            return callback.onClick(e);
          }
        });
        if ((callback != null) && ((callback.onHoverIn != null) || (callback.onHoverOut != null))) {
          hoverIn = function(e) {
            if (callback.onHoverIn != null) {
              return callback.onHoverIn(e);
            }
          };
          hoverOut = function(e) {
            if (callback.onHoverOut != null) {
              return callback.onHoverOut(e);
            }
          };
          return li.hover(hoverIn, hoverOut);
        }
      };
    })(this);
    results = [];
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      results.push(addLi(item));
    }
    return results;
  },
  slipping: function(config) {
    var max, maxEle, min, minEle, onEnd, range;
    minEle = this.find('#min');
    maxEle = this.find('#max');
    range = {
      x: {
        min: 0,
        max: 215
      },
      y: {
        min: 0,
        max: 0
      }
    };
    min = DragDrop.bind(minEle[0]);
    min.setBoundingBox(range);
    max = DragDrop.bind(maxEle[0]);
    max.setBoundingBox(range);
    minEle.css('left', config.min / config.unit * 195 + 'px');
    maxEle.css('left', config.max / config.unit * 195 + 'px');
    minEle.find('.text').text(config.min + config.postfix);
    maxEle.find('.text').text(config.max + config.postfix);
    onEnd = (function(_this) {
      return function(e, ele) {
        var anNum, element, num;
        if (e != null) {
          element = e.binding.element;
        } else {
          element = ele;
        }
        num = Math.ceil(element.offsetLeft / 195 * config.unit);
        _this.find(element).find('.text').text(num + config.postfix);
        anNum;
        if (_this.find(element).attr('id') === 'max') {
          anNum = Math.ceil(_this.find('#min')[0].offsetLeft / 195 * config.unit);
        } else {
          anNum = Math.ceil(_this.find('#max')[0].offsetLeft / 195 * config.unit);
        }
        if (num > anNum) {
          config.max = num;
          config.min = anNum;
        } else {
          config.max = anNum;
          config.min = num;
        }
        if (_.isFunction(config.onEnd)) {
          return config.onEnd(num, element);
        }
      };
    })(this);
    min.bindEvent('dragend', onEnd);
    max.bindEvent('dragend', onEnd);
    return this.bind('click', function(e) {
      var current, ox;
      ox = e.offsetX;
      min = Math.abs(minEle[0].offsetLeft - ox);
      max = Math.abs(maxEle[0].offsetLeft - ox);
      current = max > min ? minEle : maxEle;
      if (ox > 20) {
        current.css('left', ox + "px");
        return onEnd(null, current[0]);
      }
    });
  }
});

loadCity = function(cityId, callback) {
  if (cityId != null) {
    showCity(cityId, callback);
    return callback(cityId);
  } else {
    return api.loadCity().success(function(data) {
      showCity(data.data.cityId, callback);
      return callback(data.data.cityId);
    });
  }
};

showCity = function(cityId, callback) {
  var citys, result;
  citys = [
    {
      id: 802,
      name: "上海"
    }, {
      id: 867,
      name: "苏州"
    }
  ];
  $('#city').pullDown(citys, {
    onClick: function(e) {
      if (callback != null) {
        callback($(e.currentTarget).attr('data-id'));
      }
      if ($('#areaFindHouse>a').length > 0) {
        return $('#areaFindHouse>a').remove();
      }
    }
  });
  $('#city>ul').css('top', '26px');
  result = _.find(citys, function(c) {
    return c.id + "" === cityId;
  });
  result = result || citys[0];
  return $('#city>span').text(result.name);
};

$.extend({
  getUrlVars: function() {
    var addVars, hash, hashes, href, i, index1, index2, len, vars;
    href = window.location.href;
    index1 = href.indexOf('?');
    index2 = href.indexOf('#');
    if (index2 > 0) {
      href = href.slice(index1 + 1, index2);
    } else {
      href = href.slice(index1 + 1);
    }
    hashes = href.split('&');
    vars = {};
    addVars = function(hash) {
      var o;
      o = hash.split('=');
      return vars[o[0]] = decodeURI(o[1]);
    };
    for (i = 0, len = hashes.length; i < len; i++) {
      hash = hashes[i];
      addVars(hash);
    }
    return vars;
  },
  addFavorite: function() {
    var title, url;
    title = document.title;
    url = location.href;
    if (window.sidebar != null) {
      return window.sidebar.addPanel(title, url, "");
    } else if (document.all != null) {
      return window.external.AddFavorite(url, title);
    } else {
      return alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
  }
});

loadEasyMap = function(x, y, selector, city) {
  var map, marker;
  map = new BMap.Map(selector);
  marker = new BMap.Marker(new BMap.Point(x, y));
  map.centerAndZoom(new BMap.Point(x, y), 18);
  map.addControl(new BMap.MapTypeControl());
  map.setCurrentCity(city);
  return map.addOverlay(marker);
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

addImages = function(images) {
  if (images == null) {
    images = [];
  }
  if (images.length === 0) {
    upUnActive();
    downUnActive();
    $('.left>img').attr('src', 'img/default_l.png');
    return $('.middle');
  } else if (images.length < 5) {
    upUnActive();
    return downUnActive();
  }
};

upActive = function() {
  return $('.middle>.up>img').attr('src', "img/shang-red.png");
};

upUnActive = function() {
  return $('.middle>.up>img').attr('src', "img/shang-grey.png");
};

downActive = function() {
  return $('.middle>.up>img').attr('src', "img/xia-red.png");
};

downUnActive = function() {
  return $('.middle>.up>img').attr('src', "img/xia-grey.png");
};

api = {
  loadCity: function() {
    return $.get(host + '/loadCity');
  },
  findDistrict: function(cityId) {
    return $.get(host + ("/findArea/" + cityId));
  },
  findPlate: function(districtId) {
    return $.get(host + '/findPlate/' + districtId);
  },
  loadDistictTree: function() {
    return $.get(host + '/loadDistictTree');
  },
  loadBuilding: function(query) {
    return $.get(host + '/building/list?' + toUrl.call(query));
  },
  loadBuildingInfo: function(buildingId) {
    return $.get(host + '/building/info/' + buildingId);
  },
  loadBuildingImage: function(buildingId) {
    return $.get(host + '/building/info/image/' + buildingId);
  },
  loadUnit: function(query) {
    return $.get(host + '/unit/findRentByBuildingId?' + toUrl.call(query));
  },
  loadUnitInfo: function(groupId) {
    return $.get(host + '/unit/info/' + groupId);
  },
  findDistrictState: function(cityId) {
    return $.get(host + '/map/findDistrictStat/' + cityId).done(function(data) {
      var district, i, len, results;
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        district = data[i];
        results.push(addCoordinate(district));
      }
      return results;
    });
  }
};

addCoordinate = function(district) {
  if (district.id === 805) {
    district.xPoint = 121.47;
    return district.yPoint = 31.22;
  } else if (district.id === 811) {
    district.xPoint = 121.5;
    return district.yPoint = 31.27;
  } else if (district.id === 816) {
    district.xPoint = 121.53;
    return district.yPoint = 31.22;
  }
};

$(function() {
  return $('.right>.add').bind('click', function() {
    return $.addFavorite();
  });
});
