$(function() {
  var input;
  input = $("input,textarea");
  return input.each(function(i, ele) {
    var text, that;
    that = $(ele);
    text = $(input[i]).attr("placeholder");
    if (that.val() === "") {
      that.val(text).addClass('placeholder');
    }
    that.focus(function() {
      if (that.val() === text) {
        return that.val("").removeClass('placeholder');
      }
    });
    return that.blur(function() {
      if (that.val() === "") {
        return that.val(text).addClass('placeholder');
      }
    });
  });
});
