var Block, addCoordinate, addImages, api, downActive, downUnActive, fixedConfig, fixedRight, host, loadCity, polishArea, setLogoCurrentCity, showCity, showDistrict, showLocation, toUrl, upActive, upUnActive;

host = "api";

if ((typeof isMobile !== "undefined" && isMobile !== null) && (isMobile.apple.phone || isMobile.android.phone)) {
  window.location.href = "http://m.loutianxia.cn";
}

setLogoCurrentCity = function(cityId) {
  return $("header>div>a[href]").attr("href", "index.html?cityId=" + cityId);
};

$.fn.extend({
  autoComplete: function(cityId) {
    $('body').bind('click', function() {
      return $(".auto-complete").hide();
    });
    return this.bind('input propertychange', (function(_this) {
      return function() {
        var input;
        input = _this;
        if ((_this.val() != null) && _this.val() !== "") {
          return api.searchByKeyword(_this.val(), cityId).success(function(data) {
            var autoComplete, item, j, len1, li;
            $(".auto-complete>li").remove();
            data = data.data;
            if (data.length > 0) {
              autoComplete = $(".auto-complete");
              for (j = 0, len1 = data.length; j < len1; j++) {
                item = data[j];
                if (!(item.id != null)) {
                  continue;
                }
                li = $("<li data-id=\"" + item.id + "\">" + item.fullName + "</li>");
                li.bind('click', function(e) {
                  e.stopPropagation();
                  input.val($(e.target).text());
                  return autoComplete.hide();
                });
                autoComplete.append(li);
              }
              return autoComplete.show();
            }
          });
        } else {
          return $(".auto-complete>li").remove();
        }
      };
    })(this));
  },
  showBuildingImgs: function(groupId) {
    var onEleActive;
    onEleActive = function(ele) {
      var src;
      src = ele.find("img").attr("src");
      this.find(".img-center>img").attr("src", src);
      this.find("ul>li").removeClass("active");
      ele.addClass("active");
      return this.index = ele.attr("data-index");
    };
    $('body').css("overflow", "hidden");
    this.css("display", "block");
    this.find("div.close").bind("click", (function(_this) {
      return function(e) {
        $('body').css("overflow", "auto");
        _this.css("display", "none");
        if (_this.imgs.length > 0) {
          _this.find("ul>li").remove();
          _this.find("ul").append("<li class=\"active\">\n  <div class=\"\"></div>\n  <img src=\"./img/default_bb.png\" alt=\"\" />\n</li>");
          _this.find("div.right").unbind("click");
          _this.find("div.left").unbind("click");
          return _this.find("div.close").unbind("click");
        }
      };
    })(this));
    this.find("div.right").bind("click", (function(_this) {
      return function(e) {
        var ele, index;
        index = parseInt(_this.index) + 1;
        if (index === _this.imgs.length) {
          index = 0;
        }
        ele = $(_this.find("ul>li").get(index));
        return onEleActive.call(_this, ele);
      };
    })(this));
    this.find("div.left").bind("click", (function(_this) {
      return function(e) {
        var ele, index;
        index = parseInt(_this.index) - 1;
        if (parseInt(_this.index) === 0) {
          index = _this.imgs.length - 1;
        }
        ele = $(_this.find("ul>li").get(index));
        return onEleActive.call(_this, ele);
      };
    })(this));
    return api.loadUnitInfo(groupId).success((function(_this) {
      return function(data) {
        var i, img, imgEle, j, len1, liEle, ref, results, ul;
        _this.imgs = data.data.imageList;
        if (_this.imgs.length > 0) {
          ul = _this.find("ul");
          liEle = _this.find("ul>li");
          liEle.remove();
          _this.find(".img-center>img").attr("src", _this.imgs[0]);
          ref = _this.imgs;
          results = [];
          for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
            img = ref[i];
            imgEle = liEle.clone();
            if (i > 0) {
              imgEle.removeClass("active");
            }
            imgEle.find("img").attr("src", img);
            _this.index = 0;
            imgEle.attr("data-index", i);
            ul.append(imgEle);
            results.push(imgEle.bind("click", function(e) {
              return onEleActive.call(_this, $(e.currentTarget));
            }));
          }
          return results;
        }
      };
    })(this));
  },
  pullDown: function(items, callback) {
    var addLi, item, j, len1, results, ul;
    this.remove('ul.pull-down');
    ul = $("<ul class='pull-down'></ul>");
    this.append(ul);
    ul.css('width', this.outerWidth() + 1);
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
          _this.children('span').html(li.attr('data-name'));
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
    for (j = 0, len1 = items.length; j < len1; j++) {
      item = items[j];
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
    minEle.find('.text').text(config.min);
    maxEle.find('.text').text(config.max);
    if (config.max === config.unit) {
      maxEle.find('.text').text("不限");
      this.find(".line>span").hide();
    }
    onEnd = (function(_this) {
      return function(e, ele) {
        var anNum, element, num;
        if (e != null) {
          element = e.binding.element;
        } else {
          element = ele;
        }
        num = Math.ceil(element.offsetLeft / 195 * config.unit);
        if (num === config.unit && $(element).attr("id") !== "min") {
          num = "不限";
          _this.find(".line>span").hide();
        } else {
          _this.find(".line>span").show();
        }
        _this.find(element).find('.text').text(num);
        anNum;
        if (_this.find(element).attr('id') === 'max') {
          anNum = Math.ceil(_this.find('#min')[0].offsetLeft / 195 * config.unit);
        } else {
          anNum = Math.ceil(_this.find('#max')[0].offsetLeft / 195 * config.unit);
        }
        if (num > anNum || num === "不限") {
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
      if ($(e.currentTarget).text() === "苏州") {
        $("#telphone").text("400-022-3773");
        setLogoCurrentCity(867);
      } else {
        $("#telphone").text("400-996-5583");
        setLogoCurrentCity(802);
      }
      if ($('#areaFindHouse>a').length > 0) {
        return $('#areaFindHouse>a').each(function(i, e) {
          if ($(e).attr("id") == null) {
            return $(e).remove();
          }
        });
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
  toTitle: function(city, district, commName, fullName) {
    return city + " " + district + " " + commName + " " + fullName;
  },
  getUrlVars: function() {
    var addVars, hash, hashes, href, index1, index2, j, len1, vars;
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
    for (j = 0, len1 = hashes.length; j < len1; j++) {
      hash = hashes[j];
      addVars(hash);
    }
    return vars;
  },
  addFavorite: function() {
    var title, url;
    title = document.title;
    url = location.href;
    if (document.all != null) {
      return window.external.AddFavorite(url, title);
    } else if (window.sidebar == null) {
      return alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
  }
});

fixedConfig = {
  begin: 0,
  end: 0,
  top: 0
};

$(function() {
  var add;
  if (window.location.href.indexOf('loutianxia') > 0) {
    $('#company').text('上海好楼网络科技');
    $('#filingNumber').text('沪ICP备15041393号');
  } else {
    $('#company').text('苏州中城房地产经纪');
    $('#filingNumber').text('苏ICP备15055482号');
  }
  if (window.sidebar != null) {
    add = $("div.right>a.add");
    if (add[0] != null) {
      add.attr("title", "楼天下");
      add.attr("href", window.location.href);
    }
  }
  return $("div#citys>a").bind('click', function(e) {
    var cityId;
    cityId = $(e.target).attr('city-id');
    setLogoCurrentCity(cityId);
    if (cityId !== "802") {
      return $("#telphone").text("400-022-3773");
    } else {
      return $("#telphone").text("400-996-5583");
    }
  });
});

fixedRight = function(begin, end, top) {
  fixedConfig.begin = begin;
  fixedConfig.end = end;
  return fixedConfig.top = top;
};

toUrl = function() {
  var key;
  return ((function() {
    var j, len1, ref, results;
    ref = _.keys(this);
    results = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      key = ref[j];
      results.push(key + "=" + this[key]);
    }
    return results;
  }).call(this)).join("&");
};

showLocation = function(query) {
  var currentCity;
  currentCity = query.cityId || 802;
  return $("#citys>a").each(function(i, e) {
    if (currentCity === $(e).attr("city-id")) {
      return $("#location").text($(e).text());
    }
  });
};

addImages = function(images) {
  var addImage, i, image, j, k, len1, len2;
  if (images == null) {
    images = [];
  }
  i = 5;
  $('.middle>.up>img').bind('click', function(e) {
    var top;
    if ($(e.target).attr('src') === 'img/shang-red.png' && i > 5) {
      top = parseInt($('.middle>.imgs>img').css('top'));
      $('.middle>.imgs>img').css('top', (top + 65) + 'px');
      downActive();
      i--;
      if (i === 5) {
        return upUnActive();
      }
    }
  });
  $('.middle>.down>img').bind('click', function(e) {
    var top;
    if ($(e.target).attr('src') === 'img/xia-red.png' && i <= images.length + 1) {
      top = parseInt($('.middle>.imgs>img').css('top'));
      $('.middle>.imgs>img').css('top', (top - 65) + 'px');
      i++;
      upActive();
      if (i === images.length) {
        return downUnActive();
      }
    }
  });
  $('.middle>.up>img').bind('clear', function(e) {
    $(".middle>.imgs>img").css('top', "0px");
    upUnActive();
    return i = 5;
  });
  addImage = function(path, index) {
    var img;
    img = $("<img height=\"50px\" width=\"80px\" index=" + index + "></img>").attr('src', path);
    if (i === 0) {
      img.addClass('active');
    }
    $('.middle>.imgs').append(img);
    return img.bind('click', function(e) {
      var ele;
      $('.show_images>.left>img').attr('src', $(e.target).attr('src'));
      ele = $(e.target);
      ele.siblings().removeClass('active');
      return ele.addClass('active');
    });
  };
  if (images.length === 0) {
    $(".up").hide();
    $(".down").hide();
    upUnActive();
    downUnActive();
    $('.show_images>.left>img').attr('src', 'img/default_bb.png');
    return $('.middle');
  } else if (images.length <= 5) {
    $('.show_images>.left>img').attr('src', images[0].path);
    for (i = j = 0, len1 = images.length; j < len1; i = ++j) {
      image = images[i];
      addImage(image.path, i);
    }
    upUnActive();
    return downUnActive();
  } else {
    $('.show_images>.left>img').attr('src', images[0].path);
    for (i = k = 0, len2 = images.length; k < len2; i = ++k) {
      image = images[i];
      addImage(image.path, i);
    }
    upUnActive();
    return downActive();
  }
};

upActive = function() {
  return $('.middle>.up>img').attr('src', "img/shang-red.png");
};

upUnActive = function() {
  return $('.middle>.up>img').attr('src', "img/shang-grey.png");
};

downActive = function() {
  return $('.middle>.down>img').attr('src', "img/xia-red.png");
};

downUnActive = function() {
  return $('.middle>.down>img').attr('src', "img/xia-grey.png");
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
    return $.post(host + '/building/list', query);
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
      var district, j, len1, results;
      results = [];
      for (j = 0, len1 = data.length; j < len1; j++) {
        district = data[j];
        results.push(addCoordinate(district));
      }
      return results;
    });
  },
  findAreaStateByDistricId: function(districtId) {
    return $.get(host + '/map/findCommStat/' + districtId);
  },
  entrustAdd: function(query, type) {
    query.type = type;
    query.source = 2;
    return $.get(host + "/entrust/add", query);
  },
  searchByKeyword: function(keyword, cityId) {
    return $.post(host + "/building/searchByKeyword", {
      keyword: keyword,
      cityId: cityId
    });
  },
  getBuildingUnitArea: function(districtId) {
    return $.get(host + "/building/getBuildingUnitArea/" + districtId);
  },
  findfloorByScreen: function(scope) {
    return $.get(host + "/map/findByScreen", scope);
  },
  findMapBuild: function(buildId) {
    return $.get(host + "/building/BuildingMapById/" + buildId);
  }
};

polishArea = function(area) {
  var b, boundaries;
  boundaries = $.parseJSON(area.bdPoint);
  return area.boundaries = (function() {
    var j, len1, results;
    results = [];
    for (j = 0, len1 = boundaries.length; j < len1; j++) {
      b = boundaries[j];
      results.push(new BMap.Point(b.lon, b.lat));
    }
    return results;
  })();
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
  } else {
    return null;
  }
};

$(function() {
  return setTimeout(function() {
    var imgs, len;
    imgs = $(".middle>.imgs");
    len = imgs.length;
    if (len > 0) {
      return setInterval(function() {
        var imgList, n;
        imgList = imgs.find('img');
        n = imgs.find('.active').attr("index");
        if (n < imgList.length - 1) {
          n++;
          imgList.eq(n).trigger('click');
          if (n > 3) {
            return $('.middle>.down>img').trigger('click');
          }
        } else {
          n = 0;
          imgList.eq(n).trigger('click');
          return $('.middle>.up>img').trigger('clear');
        }
      }, 3000);
    }
  });
});

showDistrict = function(map, boundaries) {
  var b, ply;
  if (boundaries instanceof Array) {
    boundaries = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = boundaries.length; j < len1; j++) {
        b = boundaries[j];
        results.push(new BMap.Point(b.lon, b.lat));
      }
      return results;
    })();
  }
  ply = new BMap.Polygon(boundaries, {
    strokeWeight: 2,
    strokeColor: "#ff0000"
  });
  ply.setFillOpacity(0.2);
  ply.setStrokeOpacity(0.7);
  ply.setStrokeColor("#c80000");
  ply.setStrokeWeight(4);
  return map.addOverlay(ply);
};

Block = (function() {
  function Block() {
    this.topLabelPoint = new BMap.Point(parseFloat(this.x) + this.deviation.top.x, parseFloat(this.y) + this.deviation.top.y);
    this.topLabel = new BMap.Label(this.name, {
      position: this.topLabelPoint
    });
    this.topLabel.setStyle(this.style);
    this.topLabel.disableMassClear();
    this.bottomLabelPoint = new BMap.Point(parseFloat(this.x) + this.deviation.bottom.x, parseFloat(this.y) + this.deviation.bottom.y);
    this.bottomLabel = new BMap.Label(this.groupNum + '套', {
      position: this.bottomLabelPoint
    });
    this.bottomLabel.setStyle(this.style);
    this.bottomLabel.disableMassClear();
    this.circlePoint = new BMap.Point(this.x, this.y);
    this.circle = new BMap.Circle(this.circlePoint);
    this.circle.addEventListener('mouseover', (function(_this) {
      return function(e) {
        showDistrict(_this.map, _this.boundaries);
        _this.circle.setFillColor(_this.activeColor);
        return _this.circle.setStrokeColor(_this.activeColor);
      };
    })(this));
    this.circle.addEventListener('mouseout', (function(_this) {
      return function(e) {
        _this.circle.setStrokeColor(_this.backgroundColor);
        _this.circle.setFillColor(_this.backgroundColor);
        return _this.map.clearOverlays();
      };
    })(this));
    this.circle.setStrokeWeight(1);
    this.circle.getStrokeOpacity(0.1);
    this.circle.setStrokeColor(this.backgroundColor);
    this.circle.setFillColor(this.backgroundColor);
    this.circle.disableMassClear();
  }

  Block.prototype.backgroundColor = '#e56565';

  Block.prototype.activeColor = '#c80000';

  Block.prototype.radii = 2000;

  Block.prototype.basicZoom = 12;

  Block.prototype.deviation = {
    top: {
      x: -0.0119,
      y: 0.008
    },
    top4: {
      x: -0.0119,
      y: 0.008
    },
    bottom: {
      x: -0.01,
      y: 0
    }
  };

  Block.prototype.resetZoom = function(zoom) {
    var l, level;
    level = parseFloat(zoom) - parseFloat(this.basicZoom);
    l = Math.pow(2, level);
    this.circle.setRadius(this.radii / l);
    this.topLabelPoint.lng = this.x + this.deviation.top.x / l;
    this.topLabelPoint.lat = this.y + this.deviation.top.y / l;
    this.bottomLabelPoint.lng = this.x + this.deviation.bottom.x / l;
    this.bottomLabelPoint.lat = this.y + this.deviation.bottom.y / l;
    return this.show();
  };

  Block.prototype.show = function() {
    this.map.addOverlay(this.topLabel);
    this.map.addOverlay(this.bottomLabel);
    return this.map.addOverlay(this.circle);
  };

  Block.prototype.hide = function() {
    this.map.removeOverlay(this.circle);
    this.map.removeOverlay(this.topLabel);
    return this.map.removeOverlay(this.bottomLabel);
  };

  return Block;

})();
