$(function() {
  var init, lis;
  (init = function() {
    var a, article, articles, id;
    id = $("div.contactus-content ul>li.active").attr("data-id");
    articles = $("div.contactus-content article");
    articles.hide();
    article = $(((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = articles.length; i < len; i++) {
        a = articles[i];
        if ($(a).attr("data-id") === id) {
          results.push(a);
        }
      }
      return results;
    })())[0]);
    return article.show();
  })();
  lis = $("div.contactus-content ul>li");
  return lis.bind("click", function(e) {
    lis.removeClass("active");
    $(e.target).addClass("active");
    return init();
  });
});
