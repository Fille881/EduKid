var app = {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
  bgcolor: '#006994',
};
app.countries = {}; // This will hold the json map-data
app.pointsP1 = 0;
app.pointsP2 = 0;
app.map = {}; // Will hold the map plugin
app.tries = {};
app.playerCounter = 0;
app.playerTurn = ["player1", "player2"];
app.pointsToDiv;
app.player1Countries = []; //holds countries player 1
app.player2Countries = []; //holds countries player 2
app.palette = ['green', 'orange', 'red', '#1808FF', '#FFFF08', '#000000'];
// When the browser has finished loading
$(document).ready(function() {
  'use strict';
  console.log("Good day, we are running!");
  // Let us start up this application  
  loadMap();
  playerSelected(app.playerCounter);
  resizeMap();
  $(window).resize(resizeMap);
  localStorage.clear();
  // Initialize the tour
  //tour.init();
  // Start the tour
  //tour.start();
  
 
});

// Fetches json-data for map and starts the jquery map plugin
function loadMap() {
  'use strict';
  $.getJSON('../maps/' + app.settings.mapname + '.json', function( data ) {
      app.countries = data.country; // Store the json-data in our app-object, so we can use it everywhere
      app.map = new jvm.Map({
        container: $('#map'),
        map: app.settings.mapname,
        backgroundColor: "#ccccff",
        zoomButtons : false,
        regionsSelectable: true,
        markersSelectable: true,
        regionStyle: {
          initial:{
            fill: "white",
          }
        },
        series: {
	        regions:[{
		        values: {
			        
		        },
		        attribute: 'fill'
	        }]
        },
        selectedRegions: [getRandomCountryCode(data)],
        onRegionTipShow: function(event, label, code) {
          var regionName = app.map.getRegionName(code);
          var countrypoints;

          app.countries.forEach(function(country) {
            if (regionName === country.name) {
              countrypoints = country.points
            }
          });

          var labelflag = '<img src="../img/flags/'+ code + '.png" width="16px" height="11px">';
          var labelpoints = '<br>This country is worth ' + countrypoints + ' points.';
          label.html(labelflag + labelpoints);


       },
        onRegionClick: function(event, code){
          var tries = app.tries[app.map.getRegionName(code)];
          var regionName = app.map.getRegionName(code);
          console.log("Tries: " + tries)
          if(tries === undefined || tries <= 3){
            if(!app.map.regions[code].element.isSelected){
              askQuestionOnClick(code);
            }else{
              swal("Already selected!");
              event.preventDefault();
            }
            
          }else if(tries === 4){
            app.iniBG = "red";
            swal(regionName, "Out of tries!", "error");
          }

          
        },
      }); // new jvm.Map

  }); //$.getJSON
  
 }


//Returns a random country code from JSON file
function getRandomCountryCode(){
  'use strict';
  var random_id = Math.floor(Math.random()*app.countries.length);
  return app.countries[random_id].code;
}

//responsive map resize
function resizeMap(){
  $("#main").width($(window).width());
  $("#map").height($(window).height());
  $(".col-md-2").height($(window).height());

  
}

//Ask question and validates answer
function askQuestionOnClick(code){
  'use strict';
  var regionName = app.map.getRegionName(code);
  swalPrompt(regionName, code);
}

//deselects clicked on region, used when answer is false. 
//Explanation: if regions isSelected, create an object "o", 
//add to it property "code"(dynamic value, current country code) with value "false"
//call setSelectedRegions with that property: value key
function deselectCountry(code){
console.log(code) 
  if(app.map.regions[code].element.isSelected) {
      console.log("Auto-deselecting: " + code); 
      var o = {};
      o[code] = false;  
      app.map.setSelectedRegions(o);
  } 
}



//change background color depending on current player number
function changeBGcolor(playerCounter){
  console.log("Player counter: " + app.playerCounter);
  if(app.playerCounter % 2 != 0){
    app.map.setBackgroundColor("#ccccff");
  }else{
    app.map.setBackgroundColor("#F5CCA3");
  }  
}

//colors the region. pass the color (hex or word) as an argument
function regionColorOnAnswer(country, color){
  var colorcountry = {};
  colorcountry[country.code] = color;
  app.map.series.regions[0].setValues(colorcountry);
}

// determine which player is selected and is allowed to play
function playerSelected(playerCounter){

	if (playerCounter % 2 == 0){
		$("#points1").empty();
		$('#points1').append("Player 1: " + " " + app.pointsP1 + " " +"points"); 
		$('#'+ app.playerTurn[0]).css({'background-color': '#ccccff','font-weight':'600'});
		$('#'+ app.playerTurn[1]).css({'background-color': '#F5CCA3','font-weight':'100'});
		app.pointsToDiv = app.playerTurn[0];	
	}
	else{
		$("#points2").empty();
		$('#points2').append("Player 2: " + " " + app.pointsP2 + " " +"points"); 
		$('#'+ app.playerTurn[0]).css({'background-color': '#ccccff','font-weight':'100'});
		$('#'+ app.playerTurn[1]).css({'background-color': '#F5CCA3','font-weight':'600'});
		app.pointsToDiv = app.playerTurn[1];			
	}
}

function showConqueredCountries(playerCounter){
	
		if (playerCounter % 2 == 0){
			
			$("#list1").empty();
	 		jQuery.each( app.player1Countries, function( i, countries ) {	
		 	$( "#list1").append('<li>' + countries + '</li>' ); 
			});
			
		}else{
			$("#list2").empty();
	 		jQuery.each( app.player2Countries, function( i, countries ) {	
		 	$( "#list2").append('<li>' + countries + '</li>' );
				
		});

	}
}


// Instance the tour
var tour = new Tour({
  steps: [
  {
    //path: "europe.html",
    element: "#map",
    title: "This is a map",
    content: "In the game of maps you win or you die"
  },
  {
    element: "#points",
    title: "These are your points",
    content: "Points are good"
  }

]});



