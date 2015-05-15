var app = app || {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
  bgcolor: '#006994',
  language: 'english',
};
app.countries = {}; // This will hold the json map-data
app.map = {}; // Will hold the map plugin
app.tries = {};
app.translations = {}; // language json loaded here
app.currentPlayer = function () {
  var curplayer = 0;
  return {
    change: function() {
      curplayer = (curplayer + 1) % 2; // shifts between 0 and 1
    },
    get: function () {
      return curplayer;
    }
  };
}();

app.playerNames = ["player1", "player2"];
app.palette = ['green', 'orange', 'red', '#1808FF', '#FFFF08', '#000000'];

app.players = []; // Will contain 2 Player-objects



// The Player class //

function Player() {
  this.points = 0;
  this.countries = [];
}

Player.prototype.addpoints = function (points) {
  this.points = this.points + points;
};
Player.prototype.addcountry = function (name, points, code) {
  this.countries.push({
    name: name,
    points: points,
    code: code,
  });
};

/////


// When the browser has finished loading
$(document).ready(function() {
  'use strict';
  //endturn();
  // Let us start up this application  
  app.EduMap.init(); // Load the map
  resizeMap();
  $(window).resize(resizeMap);
  localStorage.clear();

  app.players.push(new Player());
  app.players.push(new Player());

  init_language();

  // Initialize the tour
  //app.tour.init();
  // Start the tour
  //app.tour.start();
  
  // Bind buttons
  $(".btn-endturn1, .btn-endturn2").click(endturn);

 
});

function init_language () {
  console.log("init lanaguage");
  i18n.init({ lng: 'en' }, function(t) {
    $(document.body).i18n();
  });
}


//ends player turn
function endturn(){
               
    app.currentPlayer.change();
    app.EduMap.changeBGcolor(); 
    // Remember to change classes here for bold
    console.log(app.currentPlayer.get());
}


//responsive map resize
function resizeMap(){
  $("#main").width($(window).width());
  $("#map").height($(window).height());
  $(".col-md-2").height($(window).height());
  
}

function setLanguage(lang) {
  i18n.setLng(lang, function(t) {
    $(document.body).i18n();
  });
  
}


<<<<<<< HEAD
//creates a list for each player with a list item for each conquered country ( flag, name, points)
function showConqueredCountries(playerCounter){
		if (playerCounter % 2 == 0){
			$("#list1").empty();
			$("#list1").append('<p class="list-group-item nav-header list-group-item-info"><small> Total points: </small>' + app.pointsP1 + '</p>' );	 		
	 		$.each( app.playerCountries.player1, function(i, country) {
		 		$("#list1").append('<li class="list-group-item" id=' + country.name + '><span class="flag"></span><span class="badge">' + country.points + '</span>'  + ' '  + country.name +' </li>' ); 
        $("#" + country.name + " .flag").css('background-image', 'url(../img/flags/squareflags/' + country.name + '.png)');
        sortConqueredCountries("#list1");
			});	
		}else{
			$("#list2").empty();
      $("#list2").append('<p class="list-group-item nav-header list-group-item-info"><small> Total points: </small>' + app.pointsP2 + '</p>' );      
      $.each( app.playerCountries.player2, function(i, country) {
        $("#list2").append('<li class="list-group-item" id=' + country.name + '><span class="flag"></span><span class="badge">' + country.points + '</span>'  + ' '  + country.name +' </li>' ); 
        $("#" + country.name + " .flag").css('background-image', 'url(../img/flags/squareflags/' + country.name + '.png)');
        sortConqueredCountries("#list2");
    }); 
	}	
=======
/////// Views /////////

//Shows a list with the player's conquered countries
//Uses a template from the bottom of the html file ( flag, name, points)
function showConqueredCountries(playerObj){

  //var playerObj = app.players[app.currentPlayer.get()]; //get the object of the current player
  var curPlayer = app.currentPlayer.get();
  var elem = "#list" + (curPlayer + 1);
  var template = $("#showConqueredCountries").html(); //get our htmltemplate
  var playerdata = { // prepare data to put into our html-template
    playerpoints: playerObj.points,
    playerCountries: playerObj.countries.map(function translateNames (playercountry) {
      return {
        name: i18n.t("country.name."+playercountry.code),
        points: playercountry.points,
        code: playercountry.code,
        flagname: playercountry.name
      };
    })
  };

  var renderedhtml = Mustache.render(template, playerdata); // Let Mustache put in the data
  $(elem).html(renderedhtml); // Insert our new html to the playerlist
  $(elem).i18n();
>>>>>>> internationalization
}

//function to sort conquered countries alphabetically
function sortConqueredCountries(list){
  var $list = $(list);
  $list.children().detach().sort(function(a, b) {
      return $(a).text().localeCompare($(b).text());
    }).appendTo($list);
}

/////// Instance the tour ////////
app.tour = new Tour({
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



