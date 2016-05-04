$(function() {
  var current, query, urlVars;
  urlVars = $.getUrlVars();
  if (urlVars.cityId != null) {
    current = $("div#citys>a").filter(function(i, e) {
      return $(e).attr('city-id') === urlVars.cityId;
    });
    $("#location").text(current.text());
  }
  query = {
    cityId: urlVars.cityId || 802,
    companyName: null,
    companyService: null
  };
  query.companyName = encodeURI($("#companyName").text());
  query.companyService = encodeURI($("#companyService").text());
  $("input,textarea").bind('blur', function(e) {
    return query[$(e.target).attr("name")] = e.target.value.replace(/\s/g, "");
  });
  $("input,textarea").bind('focus', function(e) {
    return $('div.error').text("");
  });
  $("div.sure").bind('click', function(e) {
    if ((query.tel != null) && /^\S/.test(query.tel)) {
      return api.entrustAdd(query, 3).then(function(data) {
        var success;
        $("input").val("");
        success = $("<div class=\"service-success\">\n  <section class=\"service\">\n    <div class=\"title\">\n      恭喜您，申请成功\n    </div>\n    <div class=\"sure\">\n      确定\n    </div>\n  </section>\n</div>").appendTo($(document.documentElement));
        $(document.documentElement).css('overflow', 'hidden');
        $(window).scrollTop(0);
        return success.find('div.sure').bind('click', function() {
          success.remove();
          return $(document.documentElement).css('overflow', 'auto');
        });
      });
    } else {
      return $('div.error').text("请输入手机号/座机");
    }
  });
  return $("div#citys>a").bind('click', function(e) {
    query.cityId = $(e.target).attr('city-id');
    return $("#location").text($(e.target).text());
  });
});
