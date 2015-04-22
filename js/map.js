function loadMap(map){
      map = new jvm.Map({
      container: $('#map'),
      map: map,//map file
      backgroundColor: ['#1E90FF'],//map background color    
      regionsSelectable:true,//this needs to be true to be able to select a region
      onRegionClick: function(event, code){
        var map = $('#map').vectorMap('get', 'mapObject');//gets the map data
        var regionName = map.getRegionName(code);//gets code of current country
        $.getJSON('../countries.json', function(data) {
          for (var i in data.country) {//loops through json file
            if (data.country[i].name === regionName){//finds which json field matches the current region country name
              var answer = prompt("Question for " + code + ": " + data.country[i].question, "Not much brah.");//asks the question
              if(data.country[i].answer === answer){//checks if answer correct
                console.log("Correct!");//test purposes
                map.setSelectedRegions(code);
                console.log(map.getSelectedRegions(code).indexOf(code));
              }else{
                var index = map.getSelectedRegions(code).indexOf(code);
                console.log(index + ", " + code);
                console.log("Wrong. Try again.");
              }
            }
          }
        });
      },

    });
}
  

