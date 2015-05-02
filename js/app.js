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
        var x;
        for (var i in data.country) {
        if(regionName === data.country[i].name){
          var x = data.country[i].points;
        }
      };
       label.html('<img src=\"../img/flags/'+ code + '.png\" width=\"16px\" height=\"13px\""><br>This country is worth ' + x + ' points.');   
       //label.html('');    
     },
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


function deselectCountry(code){
	
	  if(map.regions[code].element.isSelected) {
		    console.log("Auto-deselecting: " + code);
		
		    var o = {};
		    o[code] = false;
		
		    map.setSelectedRegions(o);
		}
	
}

//Ask question and validates answer
function askQuestionOnClick(data, code){
  var mapObj = $('#map').vectorMap('get', 'mapObject');
  var regionName = mapObj.getRegionName(code);
  var counter = 0;
  for (var i in data.country) {
	var currentCode = data.country[i].code;
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
            console.log("That was your last try. Game over!");
            deselectCountry(code);   
          }
        }
      }
    }
  }     
}

