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
       label.html('<img src=\"../img/flags/'+ code + '.png\" width=\"16px\" height=\"11px\""><br>This country is worth ' + x + ' points.');   
       //label.html('');    
     },
      onRegionClick: function(event, code){
        $.getJSON('../maps/' + mapString + '.json', function( data ) {
          askQuestionOnClick(data, code, mapString);
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
function askQuestionOnClick(data, code, mapString){
  var mapObj = $('#map').vectorMap('get', 'mapObject');
  var regionName = mapObj.getRegionName(code);
  var counter = 0;
  swalPrompt(mapString, regionName);     
}

function swalPrompt(mapString, regionName){
  $.getJSON('../maps/' + mapString + '.json', function( data ) {
    for (i in data.country){
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

