var app = {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
  bgcolor: '#ccccff',
};
app.countries = {}; // This will hold the json map-data
app.pointsP1 = 0;
app.pointsP2 = 0;
app.map = {}; // Will hold the map plugin
app.tries = {};
app.playerCounter = 0;
app.playerTurn = ["player1", "player2"];
app.pointsToDiv;
app.player1Countries = []; //holds countries
app.player2Countries = [];
app.palette = ['green', 'orange', 'red', '#1808FF', '#FFFF08', '#FFFFF'];
app.iniBG;

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
        backgroundColor: app.settings.bgcolor,
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

function swalPrompt(regionName, code){
  'use strict';
    var currentAnswer;

    // Filter out the country with the selected region name
    var country = app.countries.filter(function(country) {
      return country.name == regionName;
    })[0]; // Get the first element, it will only be one
    if (!app.tries[country.name]){
       var counter = 0;
    }
    else{
      counter = app.tries[country.name];
      console.log(counter);
    } 

    if (country) {
      swal({
        title: country.name,
        text: country.question,
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Write your answer"
        },
        function(inputValue){ // Called when we press "Ok"
          if (inputValue === false) {
            deselectCountry(code);
            return false;
          }
          if (inputValue === "") {
            swal.showInputError("You need to write something!");
            return false;
          }
          if(inputValue === country.answer && counter < 3){
            console.log("Correct answer.");
            swal("Nice!", "You wrote: " + inputValue + "Points: " + country.points, "success");
            
            if (app.pointsToDiv == "player1"){
	            app.pointsP1 = app.pointsP1 + parseInt(country.points);
				$('#' + app.pointsToDiv).text("Player 1: " + " " + app.pointsP1 + " " +"points"); 
				
	            }
	            else{
		            app.pointsP2 = app.pointsP2 + parseInt(country.points);
					$('#' + app.pointsToDiv).text("Player 2: " + " " + app.pointsP2 + " " +"points"); 	
	            }
            
            	if (app.pointsToDiv == "player1"){
	            	regionColorOnAnswer(country, app.palette[0]);
            		}
            		else{
	            		regionColorOnAnswer(country, app.palette[3]);
	            		}
            counter++;
            app.tries[country.name] = counter;
          }else if(inputValue != country.answer && counter < 2){
            swal.showInputError("Incorrect answer! " + (2 - counter) + " tries left.");
            counter++;
            console.log(country.name + ": " + counter);
            app.tries[country.name] = counter;
            if (app.pointsToDiv == "player1"){
	            	regionColorOnAnswer(country, app.palette[1]);
            		}
            		else{
	            		regionColorOnAnswer(country, app.palette[4]);
            			}
          }else if(counter === 2){
            counter += 2;
            app.tries[country.name] = counter;
            swal("No tries left!", "error");  
            app.playerCounter++;
            playerSelected(app.playerCounter);
            if(app.playerCounter % 2 === 0){
              app.settings.bgcolor = "red";
              console.log(app.settings.bgcolor);
            }else{
              app.settings.bgcolor = "yellow";
              console.log(app.settings.bgcolor);
            }
            if (app.pointsToDiv == "player1"){
	            regionColorOnAnswer(country, app.palette[2]);
            }else{
          		regionColorOnAnswer(country, app.palette[5]);
        		}
          }
      });
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
		$('#'+ app.playerTurn[0]).css({'background-color': '#ccccff','font-weight':'600'});
		$('#'+ app.playerTurn[1]).css({'background-color': 'lavenderblush','font-weight':'100'});
		app.pointsToDiv = app.playerTurn[0];	
	}
	else{
		$('#'+ app.playerTurn[0]).css({'background-color': '#ccccff','font-weight':'100'});
		$('#'+ app.playerTurn[1]).css({'background-color': 'lavenderblush','font-weight':'600'});
		app.pointsToDiv = app.playerTurn[1];			
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



