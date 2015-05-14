var app = app || {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
  bgcolor: '#006994',
};
app.countries = {}; // This will hold the json map-data
app.map = {}; // Will hold the map plugin
app.tries = {};
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

app.players = [];



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
  endturn();
  // Let us start up this application  
  app.EduMap.init(); // Load the map
  resizeMap();
  $(window).resize(resizeMap);
  localStorage.clear();

  app.players.push(new Player());
  app.players.push(new Player());
  // Initialize the tour
  //app.tour.init();
  // Start the tour
  //app.tour.start();
  
 
});

//ends player turn
function endturn(){
  $(".btn-endturn1, .btn-endturn2").click(function(){
    EduMap.changeBGcolor();            
    app.currentPlayer.change();
    // Remember to change classes here for bold
    console.log(app.currentPlayer.get());
  });
}


//responsive map resize
function resizeMap(){
  $("#main").width($(window).width());
  $("#map").height($(window).height());
  $(".col-md-2").height($(window).height());
  
}


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
    playerCountries: playerObj.countries,
  };

  var renderedhtml = Mustache.render(template, playerdata); // Let Mustache put in the data
  $(elem).html(renderedhtml); // Insert our new html to the playerlist

}


/////// Instance the tour
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



