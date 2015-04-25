//Directs user to correct map
$(document).ready(function() {
    $(".btn").click(function() {
        window.location.assign('map_game/' + this.id + '.html');
    })
});

//load map and basic functionality
function loadMap(map){
  var specificMap = map;
  y = getRandomCountryCode(specificMap);
  console.log("y is: " + y);
  map = new jvm.Map({
    container: $('#map'),
    map: map,//pass a string when you call the function, the string determines which function is called
    backgroundColor: ['#1E90FF'],//map background color    
    regionsSelectable:true,//this needs to be true to be able to select a region
    selectedRegions: ["RU"],
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
              console.log("Wrong. Try again.");
            }
          }
        }
      });
    },
  });
}

//gets all country codes from json file and puts them in an array
function getRandomCountryCode(specificMap){
  
  var obj = $.getJSON('../maps/' + specificMap + '.json', function( data ) {
    var countries = [];
    for (var i in data.country) {
      countries.push(data.country[i].code);
    }
    var rndCountryCode = countries[Math.floor(Math.random()*countries.length)];
    getValue(rndCountryCode);
  });
};

function getValue(rndCountryCode){
    x = rndCountryCode;
    console.log("X is: " + x);
    return x;
  };


