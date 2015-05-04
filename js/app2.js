var app = {};
app.settings = {
  mapname: 'world_mill_en',
};
app.data = {}; // This will hold the json map-data



//Directs user to correct map
$(document).ready(function() {
  console.log("Hello I am ready!");
    $(".btn").click(function() {
        window.location.assign('map_game/' + this.id + '.html');
    });
});

var points = parseInt('0');

function loadMap() {
  'use strict';
  $.getJSON('../maps/' + app.settings.mapname + '.json', function( data ) {
      app.data = data;

      map = new jvm.Map({
      container: $('#map'),
      map: app.settings.mapname,
      backgroundColor: ['#1E90FF'],
      regionsSelectable: true,
      markersSelectable: true,
      selectedRegions: [getRandomCountryCode(data)],
      onRegionTipShow: function(event, label, code){
        var mapObj = $('#map').vectorMap('get', 'mapObject');
        var regionName = mapObj.getRegionName(code);
        var x;
        for (var i in data.country) {
        if(regionName === data.country[i].name){
          x = data.country[i].points;
        }
      }
       label.html('<img src=\"../img/flags/squareflags/'+ name + '.png\" width=\"16px\" height=\"11px\""><br>This country is worth ' + x + ' points.');

     },
      onRegionClick: function(event, code){
        askQuestionOnClick(app.data, code, app.settings.mapname);
      },
    }); // new jvm.Map
  }); //ajax
}

//Returns a random country code from JSON file
function getRandomCountryCode(data){
  'use strict';
  var countries = [], rndCountry;
  for (var i in data.country) {
    console.log('country:', i);

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
  swalPrompt(regionName);
}

function swalPrompt(regionName){
  $.getJSON('../maps/' + app.settings.mapname + '.json', function( data ) {
    for (var i in data.country){
      if(regionName === data.country[i].name){
        currentAnswer = data.country[i].answer;
        swal({
          title: data.country[i].name,
          text: data.country[i].question,
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          animation: "slide-from-top",
          inputPlaceholder: "Write your answer"
          },
          function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
              swal.showInputError("You need to write something!");
              return false
            }
            if (inputValue == currentAnswer){
              console.log("correct");
              swal("Nice!", "You wrote: " + inputValue, + "success" + data.country[i].points);
              points = points + parseInt(data.country[i].points);
			  $('#points').text("You've got" + " " + points + " " +"points");

            }else{
              console.log("incorrect");
              console.log(inputValue);
            }
        });
      }
    }
  });
}
