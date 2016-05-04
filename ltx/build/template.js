    setTimeout(function(){

        var x=document.getElementsByClassName("haolou-input-x")[0].value;
        var y=document.getElementsByClassName("haolou-input-y")[0].value;
        // var map = new BMap.Map("map");
        var point = new BMap.Point(x,y)
        // map.centerAndZoom(point, 14);
        var   distance = 245
        var localSearch = new BMap.LocalSearch(point,{
          onSearchComplete:function(result){
            if(result.keyword=="银行"){
              var  list=[];
              for (var i = 0; i < 4; i++) {
                var  title = result.getPoi(i)?result.getPoi(i).title:""

                list.push(title)
              };
              var a =list.join(" ")
              document.getElementById("haolou-content-bank").innerText=a
              document.getElementById("bank-num").innerText="共"+result.getNumPois()+"等"
            }

            if(result.keyword=="美食"){
                          var  list=[];
              for (var i = 0; i < 4; i++) {
               var  title = result.getPoi(i)?result.getPoi(i).title:""

                list.push(title)
              };
              var a =list.join(" ")
              document.getElementById("haolou-content-food").innerText=a
              document.getElementById("bank-food").innerText="共"+result.getNumPois()+"等"
            }
            if(result.keyword=="酒店"){
                           var  list=[];
              for (var i = 0; i < 4; i++) {
                              var  title = result.getPoi(i)?result.getPoi(i).title:""

                list.push(title)
              };
              var a =list.join(" ")
              document.getElementById("haolou-content-hotel").innerText=a
              document.getElementById("hotel-num").innerText="共"+result.getNumPois()+"等"
            }
            if(result.keyword=="公交"){
                           var  list=[];
              for (var i = 0; i < 4; i++) {


                   var  title = result.getPoi(i)?result.getPoi(i).title:""

                list.push(title)
              };
              var a =list.join(" ")
              document.getElementById("haolou-content-jiao").innerText=a
              document.getElementById("jiao-num").innerText="共"+result.getNumPois()+"等"
            }
          }
        })
        localSearch.searchNearby("银行",point,distance)
        localSearch.searchNearby("美食",point,distance)
        localSearch.searchNearby("酒店",point,distance)
        localSearch.searchNearby("公交",point,distance)
      },3000)