var app = app || {}; // Our single global variable, that holds useful things! =)
app.settings = {
  mapname: 'europe_mill_en',
  bgcolor: '#006994',
  language: 'english'
};
app.countries = {}; // This will hold the json map-data
app.map = {}; // Will hold the jVector map plugin object
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


// When the browser has finished loading //
$(document).ready(function() {
  'use strict';
  //endturn();
  // Let us start up this application  
  setBodyBGcolor();
  mainMenu();
  $("#mainMenuButton").click(mainMenu);
  $("#startButton").click(startup);
  $("#answer1").click(checkAnswer);
  
});

// This is run when "Start game" on the menu is clicked
function startup() {
  // Do some clearing
  app.map.reset = {};
  app.countries = {}; // This will hold the json map-data
  app.map = {}; // Will hold the map plugin
  
  loadMap();
  resizeMap(); // Resize to map to fit the screen
  $(window).resize(resizeMap); // bind the function to run when the browser changes size
  localStorage.clear();

  app.players.push(new Player());
  app.players.push(new Player());

  init_language();

  // Initialize the tour
  app.tour.init();
  // Start the tour
  app.tour.start();
  
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
    console.log("Current player id:", app.currentPlayer.get());
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
    // Redraw each player score list
    app.players.forEach(function (playerObj, index) {
      console.log("setting conqured for ", playerObj);
      showConqueredCountries(playerObj, index);
    });
  });
}


/////// Views /////////

//Shows a list with the player's conquered countries
//Uses a template from the bottom of the html file ( flag, name, points). (with the Mustasch library)
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


//function to sort conquered countries alphabetically   -not used-
function sortConqueredCountries(list){
  var $list = $(list);
  $list.children().detach().sort(function(a, b) {
      return $(a).text().localeCompare($(b).text());
    }).appendTo($list);
}

// Displays main menu
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
 


/////// Initiate the tour ////////
app.tour = new Tour({
  steps: [
  {
    //path: "europe.html",
    element: "#player1",
    title: "Welcome!",
    content: "In the EduKid 2-player geography quiz, you learn and win! The big thing in the middle? That's your map and gameboard. Win points by clicking or tapping on countries to answer questions."
  },
  {
    element: "#list1",
    title: "Your list of countries and points.",
    content: "Here, you'll see the countries that you have answered correctly about. You will also see how many of those so valuable points you've earned!"
  },
  {
    element: "#mainMenuButton",
    title: "The mainmenu",
    content: "By clicking on the menubutton, you can always start and restart games, find settings and other things."
  },
  {
    element: "#mainMenuButton",
    title: "Let's start!",
    content: "Have fun."
  }

]});


