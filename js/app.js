//load map and basic functionality
function loadMap(map){
  var specificMap = map;
  map = new jvm.Map({
    container: $('#map'),
    map: map,//pass a string when you call the function, the string determines which function is called
    backgroundColor: ['#1E90FF'],//map background color    
    regionsSelectable:true,//this needs to be true to be able to select a region
    onRegionClick: function(event, code){
      var map = $('#map').vectorMap('get', 'mapObject');//gets the map data
      var regionName = map.getRegionName(code);//gets name of current country
      $.getJSON('../maps/' + specificMap + '.json', function(data) {
        for (var i in data.country) {//loops through json file
          if (data.country[i].name === regionName){//finds which json field matches the current region country name
            var answer = prompt("Question for " + regionName + ": " + data.country[i].question);//asks the question
            if(data.country[i].answer === answer){//checks if answer correct
              console.log("Correct!");//test purposes
              map.setSelectedRegions(code);
            }else{
              map.clearSelectedRegions(code);
              console.log("Wrong. Try again.");
            }
          }
        }
      });
    },
  });
}

//Directs user to correct map
$(document).ready(function() {
    $(".btn").click(function() {
        window.location.assign('map_game/' + this.id + '.html');
    })
});
  

