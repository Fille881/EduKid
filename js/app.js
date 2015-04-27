//Directs user to correct map
$(document).ready(function() {
    $(".btn").click(function() {
        window.location.assign('map_game/' + this.id + '.html');
    })
});



function loadMap(mapString){
  $.getJSON('../maps/' + mapString + '.json', function( data ) {
      getRandomCountryCode(data);
      map = new jvm.Map({
      container: $('#map'),      
      map: mapString,
      backgroundColor: ['#1E90FF'],
      regionsSelectable: true,
      markersSelectable: true,
      selectedRegions: [rndCountry],
      onRegionClick: function(event, code){
        $.getJSON('../maps/' + mapString + '.json', function( data ) {
          askQuestionOnClick(data, code);
        });      
      },
    });
  });
}

//Returns a random country code from JSON file
function getRandomCountryCode(data){
  var countries = [];
  for (var i in data.country) {
    countries.push(data.country[i].code);
  }
  rndCountry = countries[Math.floor(Math.random()*countries.length)];
  return rndCountry;
}

//Ask question and validates answer
function askQuestionOnClick(data, code){
  var mapObj = $('#map').vectorMap('get', 'mapObject');
  var regionName = mapObj.getRegionName(code);
  var counter = 0;
  for (var i in data.country) {
    while (counter < 3){
      var answer = prompt("Attempt: >>" + (counter+1) + "<<. Question for " + regionName + ": " + data.country[i].question);      
      if(data.country[i].answer === answer){
        console.log("Correct!");
        mapObj.setSelectedRegions(code);
        counter = 3;
      }else{
        console.log("Please try again.");
        counter ++;
        console.log(counter);
        if(counter === 3){
          alert("That was your last try. Game over!");
          map.clearSelectedRegions();
        }
      }
    }
  }     
}