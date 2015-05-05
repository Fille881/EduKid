var app = {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
};
app.countries = {}; // This will hold the json map-data
app.points = 0;
app.map = {}; // Will hold the map plugin
app.tries = {};


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
          if(tries === undefined || tries < 2){
            askQuestionOnClick(code);
          }else{
            swal(regionName, "Out of tries!", "error");
            deselectCountry(code);
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

function resizeMap(){
  var docheight = $(window).height(); // returns height of the window
  var docwidth = $(window).width(); // returns width of the window
	
  $("#map").width(docwidth);
  $("#map").height(docheight);
  
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
              app.points = app.points + parseInt(country.points);
            $('#points').text("You've got" + " " + app.points + " " +"points");
          }else if(inputValue != country.answer && counter < 2){
            swal.showInputError("Incorrect answer! " + (2 - counter) + " tries left.");
            counter++;
            app.tries[country.name] = counter;
            console.log(app.tries);
            console.log(counter);
          }else if(counter === 2){
            swal("No tries left!", "error");
            deselectCountry(code);
          }


/*


          if(inputValue != country.answer && counter < 3){
            swal.showInputError("Incorrect answer! " + (3 - counter) + " tries left.");
            counter++;
            app.tries[country.name] = counter;
            console.log(app.tries);
            console.log(counter);
          }else if(inputValue === country.answer){
            console.log("Correct answer.");
            swal("Nice!", "You wrote: " + inputValue + "Points: " + country.points, "success");
              app.points = app.points + parseInt(country.points);

            $('#points').text("You've got" + " " + app.points + " " +"points");
          }else{
            swal("No tries left!", "error");
            deselectCountry(code);
          }*/
          
           /* if (inputValue == country.answer){
              console.log("Correct answer.");
              swal("Nice!", "You wrote: " + inputValue + "Points: " + country.points, "success");
                app.points = app.points + parseInt(country.points);

              $('#points').text("You've got" + " " + app.points + " " +"points");

            }else{
            //swal("Incorrect answer!", "error");
            //deselectCountry(code);
            console.log("Incorrect answer.", inputValue);
          }*/
      });//swal
    }
}
