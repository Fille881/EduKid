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
      //renders static country code labels, a bit annoying for now
      //Remove /*...*/ too see how it works
      /*labels:{
        regions:{
          render: function (code){
            return code;
          }
        }
      },*/
      onRegionTipShow: function(event, label, code){
        var mapObj = $('#map').vectorMap('get', 'mapObject');
        var regionName = mapObj.getRegionName(code);
        var selected = map.regions[code].element.isSelected;
        customLabel(selected, data, regionName, mapObj, label, code);   
     },
      onRegionClick: function(event, code){
        if(!map.regions[code].element.isSelected){
          $.getJSON('../maps/' + mapString + '.json', function( data ) {
            askQuestionOnClick(data, code);
          }); 
        }else{
          alert("Already selected.");
          //prevents region selection by default
          event.preventDefault();
        }     
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

//deselects clicked on region, used when answer is false. 
//Explanation: if regions isSelected, create an object "o", 
//add to it property "code"(dynamic value, current country code) with value "false"
//call setSelectedRegions with that property: value key
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

//renders custom display label 
//if region already selected -> display flag, name, points
//else -> display just points
function customLabel(selected, data, regionName, mapObj, label, code){
  if(selected === true){
    for (var i in data.country) {
      if(regionName === data.country[i].name){
        var x = data.country[i].points;
      }
    };
   label.html('<img src=\"../img/flags/'+ code + '.png\" width=\"16px\" height=\"13px\""> -- ' + regionName + '<br>This country is worth ' + x + ' points.');   
 }else{
    for (var i in data.country) {
      if(regionName === data.country[i].name){
        var x = data.country[i].points;
      }
    };
   label.html('This country is worth ' + x + ' points.');
 }   
}