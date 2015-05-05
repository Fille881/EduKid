var app = {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
};
app.countries = {}; // This will hold the json map-data
app.points = 0;
app.map = {}; // Will hold the map plugin


// When the browser has finished loading
$(document).ready(function() {
  'use strict';
  console.log("Good day, we are running!");
  // Let us start up this application
  
  loadMap();
  resizeMap();
  $(window).resize(resizeMap);
  
});

// Fetches json-data for map and starts the jquery map plugin
function loadMap() {
  'use strict';
  $.getJSON('../maps/' + app.settings.mapname + '.json', function( data ) {
      app.countries = data.country; // Store the json-data in our app-object, so we can use it everywhere
      app.map = new jvm.Map({
        container: $('#map'),
        map: app.settings.mapname,
        backgroundColor: ['#1E90FF'],
        regionsSelectable: true,
        markersSelectable: true,
        series: {
	        regions:[{
		        values: {
			        
		        },
		        attribute: 'fill'
	        }]
        },
        selectedRegions: [getRandomCountryCode(data)],
        onRegionTipShow: function(event, label, code) {
          //var mapObj = $('#map').vectorMap('get', 'mapObject');
          var regionName = app.map.getRegionName(code);
          var  countrypoints;
          console.log("Region name:", app.map.getRegionName(code));

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
          askQuestionOnClick(code);
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

function resizeMap(){
  var docheight = $(window).height(); // returns height of the window
  var docwidth = $(window).width(); // returns width of the window
	
  $("#map").width(docwidth);
  $("#map").height(docheight);
  
}

//Ask question and validates answer
function askQuestionOnClick(code){
  'use strict';
  //var mapObj = $('#map').vectorMap('get', 'mapObject');
  var regionName = app.map.getRegionName(code);
  //var counter = 0;
  swalPrompt(regionName);
}

function swalPrompt(regionName){
  'use strict';
    var currentAnswer;

    // Filter out the country with the selected region name
    var country = app.countries.filter(function(country) {
      return country.name == regionName;
    })[0]; // Get the first element, it will only be one

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
          if (inputValue === false) return false;
          if (inputValue === "") {
            swal.showInputError("You need to write something!");
            return false;
          }
          if (inputValue == country.answer){
            console.log("Correct answer.");
            swal("Nice!", "You wrote: " + inputValue + "Points: " + country.points, "success");
              app.points = app.points + parseInt(country.points);

            $('#player1').text("You've got" + " " + app.points + " " +"points");
           
           var color = country.code;
           console.log(color);
           
           //app.map.regions[0].element.style.selected.fill = '#FFFFF';
           var colorcountry = {};
           colorcountry[country.code] = '#FFFFF';
		   app.map.series.regions[0].setValues(colorcountry);
           
           

          }else{
            swal("Incorrect answer!", "error");
            console.log("Incorrect answer.", inputValue);
          }
      }); //swal
    }
}



