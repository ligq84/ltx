$(document).ready(function() {
  var current, query, type, urlVars;
  urlVars = $.getUrlVars();
  if (urlVars.cityId != null) {
    current = $("div#citys>a").filter(function(i, e) {
      return $(e).attr('city-id') === urlVars.cityId;
    });
    $("#location").text(current.text());
  }
  type = 1;
  if ($("input[name=buildingName]").length === 1) {
    type = 2;
  }
  query = {
    cityId: urlVars.cityId || 802
  };
  $("input,textarea").bind('blur', function(e) {
    return query[$(e.target).attr("name")] = e.target.value.replace(/\s/g, "");
  });
  $("input,textarea").bind('focus', function(e) {
    return $('div.error').text("");
  });
  $("div.button").bind('click', function(e) {
    if ((query.tel != null) && /^\S/.test(query.tel)) {
      return api.entrustAdd(query, type).then(function(data) {
        $('div.entrust-release-success').css("display", "block");
        return $(document.documentElement).css("overflow", "hidden");
      });
    } else {
      return $('div.error').text("请输入手机号/座机");
    }
  });
  $("div#citys>a").bind('click', function(e) {
    query.cityId = $(e.target).attr('city-id');
    return $("#location").text($(e.target).text());
  });
  return $('div.entrust-release-success div.sure').bind('click', function(e) {
    $('div.entrust-release-success').css("display", "none");
    $(document.documentElement).css("overflow", "auto");
    return window.location.href = "index.html";
  });
});
