var app = app || {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
  bgcolor: '#006994',
  language: 'english'
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
var buttonClicked = "cat";



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
  // Load the map
  setBodyBGcolor();
  mainMenu();
  $("#mainMenuButton").click(mainMenu);
  $("#startButton").click(startup);
  $("#answer1").click(checkAnswer);
  

});

function startup() {
  app.map.reset = {};
  app.countries = {}; // This will hold the json map-data
  app.map = {}; // Will hold the map plugin
  
  loadMap();
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
  
}



 



function init_language () {
  console.log("init lanaguage");
  i18n.init({ lng: 'en' }, function(t) {
    $(document.body).i18n();
  });
}


//ends player turn
function endturn(){
               
    app.currentPlayer.change();
    changeBGcolor(); 
    // Remember to change classes here for bold
    console.log(app.currentPlayer.get());
}


//responsive map resize
function resizeMap(){
  $("#main").width($(window).width());
  $("#map").height($(window).height());
  //$(".col-md-2").height($(window).height());
  
}

//Sets language, lang could be 'se' or 'en'
function setLanguage(lang) {
  i18n.setLng(lang, function(t) {
    $(document.body).i18n();
    app.players.forEach(function (playerObj, index) {
      console.log("setting conqured for ", playerObj);
      showConqueredCountries(playerObj, index);
    });
  });
}


/////// Views /////////

//Shows a list with the player's conquered countries
//Uses a template from the bottom of the html file ( flag, name, points).
// id is optional
function showConqueredCountries(playerObj, playerid){

  if (playerid === undefined) { // If function was called without playerid
  playerid = app.currentPlayer.get();
  }
  var elem = "#list" + (playerid + 1);
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

}


//function to sort conquered countries alphabetically
function sortConqueredCountries(list){
  var $list = $(list);
  $list.children().detach().sort(function(a, b) {
      return $(a).text().localeCompare($(b).text());
    }).appendTo($list);
}

function mainMenu(){
  console.log("menu translation: ", i18n.t("menu.close"));
  swal({
    title: $('#hiddenlogo').html(),
    text: Mustache.render($('#menucontent').html(), {}),
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Close",
    animation: "slide-from-bottom",
    closeOnConfirm: false,
    html: true,
  });
  
  
  
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

function checkAnswer(event){
	
	console.log("hello");
	buttonClicked = "blue";
	
}


