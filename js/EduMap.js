// This variable holds all functions that has anything to do with manipulating the jvector map.

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
  console.log(code) ;
    if(app.map.regions[code].element.isSelected) {
        console.log("Auto-deselecting: " + code); 
        var o = {};
        o[code] = false;  
        app.map.setSelectedRegions(o);
    } 
  }

  //Returns a random country code from JSON file
  function getRandomCountryCode(){
    'use strict';
    var random_id = Math.floor(Math.random()*app.countries.length);
    return app.countries[random_id].code;
  }

  function setBodyBGcolor() {
    var playerOne = "#ccccff";
    var playerTwo = "#F5CCA3";
      if(app.currentPlayer.get() === 0){
      $('body').css('background-color', playerOne);
    }else{
      $('body').css('background-color', playerTwo);
    } 
  }

  //change background color depending on current player number
  function changeBGcolor(playerCounter){
    console.log("changeBGcolor");
    var playerOne = "#ccccff";
    var playerTwo = "#F5CCA3";
    if(app.currentPlayer.get() === 0){
      app.map.setBackgroundColor(playerOne);
      setBodyBGcolor();
    }else{
      app.map.setBackgroundColor(playerTwo);
      setBodyBGcolor();
    }  
  }

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
            var labelpoints = '<br>' + i18n.t("maplabel.pointsworth") + countrypoints + i18n.t("maplabel.points");
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

   //colors the region. pass the color (hex or word) as an argument
  function regionColorOnAnswer(country, color){
    var colorcountry = {};
    colorcountry[country.code] = color;
    app.map.series.regions[0].setValues(colorcountry);
  }


