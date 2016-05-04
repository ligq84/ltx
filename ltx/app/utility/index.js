import _ from 'underscore';

export default {
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
    if(o[1]){
      return vars[o[0]] = decodeURI(o[1]);
    }

  };
  for (j = 0, len1 = hashes.length; j < len1; j++) {
    hash = hashes[j];
    addVars(hash);
  }
  return vars;
},
currentPosition:function(o){
  const  r=_.find(o.data,c=>{
    return c.id ==o.id;
  })

  return {
    x:r.xPoint,
    y:r.yPoint
  }
},
isBlockInBlockOverlays:function(block,blockOverlays){
  const result = _.find(blockOverlays,(blockOverlay)=>{
    return blockOverlay.name == block.name
  });

  if(!result){
    return false
  }else {
    return true
  }
},

factory:{
  



}



}
