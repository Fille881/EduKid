//Directs user to correct map
$(document).ready(function() {
    $(".btn").click(function() {
        window.location.assign('map_game/' + this.id + '.html');
    })
});

var points = parseInt('0');

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
      onRegionTipShow: function(event, label, code){
		  var mapObj = $('#map').vectorMap('get', 'mapObject');
		  var regionName = mapObj.getRegionName(code);
		  for (var i in data.country) {
		  	if(regionName === data.country[i].name){
			  	x = data.country[i].points;
			  }  	
			}
	      label.html("This region is worth" + " " + + x + " " + "points" );},  
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
    if(regionName === data.country[i].name){
      while (counter < 3){
        var answer = prompt("Attempt for " + data.country[i].name + ": >>" + (counter+1) + "<<. Question for " + regionName + ": " + data.country[i].question);      
        if(data.country[i].answer === answer){
          console.log("Correct!" + data.country[i].points);
          console.log(data.country[i].answer);
          mapObj.setSelectedRegions(code);
          counter = 3;
          points = points + parseInt(data.country[i].points);
          $('#points').text("You've got" + " " + points + " " +"points");
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
}

