# Structuring code
## and the changes I made

I would say the most important thing is that the code works - getting things done.
The end-user does not see (and probably don't care) how the code looks/is structured.

With that said, refactoring code can help make it a bit more redable (especially for new persons on the team), and also managable. There is no single way that is 'the way' to do it, but a matter of opinion. One more thing, it is not obligatory or anything... just a bit of a touch-up you can do if you feel like it.

pros:
- you can learn to write better code
- can make the current code more readable and managable
cons:
- you can mess it up for people
- they have to learn the code again
- also, you might spend time for no real benefit


### Below, I'll go through some javascript concepts that can aid in structuring a site

As an app gets bigger, it can be nice to separate things into modules. Preferably, functions that are about internal workings should be hidden, and then you would only expose functions that make sense for other modules to use. Example: if you have a E-commerce web site. One module could be the shopping cart. In javascript, you don't have private variables or functions easily,
but we can create the same effect with The module pattern:


```js
// We name our module shoppingcart
app.shoppingcart = function () {
    
    var items = ['cheese', 'tomatoes'];

    function addGrocery(name) {
        // Does something safe with 'items' here //
    }

    function startupthis () {
        // Initialize the shopping cart..if you need to
    }


    return {
        init : startupthis,
        addGrocery: addGrocery
    };
}(); // <-- See that this function is executed directly, giving us that object with 'init' and 'addGrocery'
```

What we see above is functions and variables defined inside another function. The outer function then returns an object with references to the functions inside.

We would use the shopping cart like this:
```js
app.shoppingcart.init();  // the startupthis-function will run
app.shoppingcart.addGrocery('Hamburger');
```
// But we can't do this:
```js
app.shoppingcart.items = ['someLettuce', 'Candy'];
```
Because there is no `items` member on the object we returned in the module -> it is accessible only within the module! That is useful, because we don't need to worry about people using internal functions and variables in weird ways in other parts of the app. It also means we are free to change anything we want inside our module, without any other part of our app breaking because it depended on our 'internal' functions.

In addition, there is no risk for a name collision if some other part of the app creates a variable named `items`, `items` here exists only within this function/module. We get one more benefit of naming the module also: If you would just have a 'loose' function called addGrocery, that could mean
'add grovery to my favorite groceries list', or 'add grocery to shopping cart', or 'add grocery to something else...'
```js
app.shoppingcart.addGrocery(); // makes it extra clear that it has to do with the shopping cart.
```


For our EduKid site, I thought we had quite the number of functions. I thought I'd just move the map-related functions to a separate file. However, that would not give the benefit of having a name like EduMap.changeBGcolor(), so that is why I used the module pattern. The drawback is that it is some extra complexity for our group, and you have to remember to add functions you want public to the 'return' in the bottom. Not sure it is worth it for our purposes.

Another thing I did was introduce a Player class that keeps every players points and countries in one place (inside a Player object). A first reason is that we started to have alot of player-related variables on our app-object:
```js
app.pointsP1 = 0;
app.pointsP2 = 0;
app.playerCounter = 0;
app.playerTurn = ["player1", "player2"];
app.pointsToDiv;
app.playerCountries = {}; //holds countries and points player 1
app.playerCountries.player1 ={}
app.playerCountries.player2 ={}
app.player2Countries = {}; //holds countries and points player 2
```

I thought I'd instead make a `Player` class, and create two of those Player objects and put in
an array app.players:
```js
// The Player class //

function Player() {
  this.points = 0;
  this.countries = [];
}
```

Javascript does not have 'class' like  many other languages do (where you can have functions inside the class etc). Instead you add functions by setting them to the functions prototype-object. Think of the functions as inside the Player() function. This may not be the most elegant part of javascript, but well, it is how it is.

```js
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


app.players = []; // Will contain 2 Player-objects
```
Then add two players somewhere suitable (when the page loads):
```js
app.players.push(new Player());
app.players.push(new Player());
```
```js
// Player 1 would have index 0 in the array, but it works:
players[0].points;   // would give us the first players points.
```

But what are some benefits with having this `Player` class instead of just loose variables?
- One thing is that we were able to easily create a function e.g. 'addcountry' for adding conquered countries to the player.
- It can be nice to keep functions closely tied to a player inside the `Player` class itself.
- If we now want to add a e.g. player color, we can easily add more functionality to the Player class.


Another thing I did was concerning the global
```js
app.playerCounter = 0;
```
which was increased everytime we used endturn().
Then you would get the current player id by
```js
if (playerCounter % 2 == 0){  // this is player1
    } else { /*this must be player 2 */ }
```

I wanted to see if I could make it simpler to get the currentPlayer-id, and also a less error-prone way of switching the currentPlayer. The thing with having a global playerCounter-variable is that every part of the app could change it, which _might_ make things more tricky if several parts of the app touches that variable.
A solution would be to hide the real variable, so that you can't do whatever you like with it. The only way to change the variable would be by to ask some function to do it. Like this:
```js
app.currentPlayer = function () {
  var curplayer = 0; // I am hidden, muhahha!
  return {
    change: function() {
      curplayer = (curplayer + 1) % 2; // shifts between 0 and 1
    },
    get: function () {
      return curplayer;
    }
  };
}();  // <- note how the outer function is executed immediately, we get the object with 'change' and 'get'.
```

This is like the module-pattern actually. We hide an variable, and only allow it to be accessed through the 'change' or 'get' functions. The `change` and `get` are variables that each hold functions.

So lets say that we want to print the points and all conquered countries of the current player.
In the previous style, it could be done like this:
```js
if (app.playerCounter % 2 == 0){
    console.log(app.pointsP1);
    app.playerCountries.player1.forEach(function(conquered) {
        console.log(conquered.name);
    });

} else {
    console.log(app.pointsP2);
    app.playerCountries.player2.forEach(function(conquered) {
        console.log(conquered.name);
    });
}
```
It works, but I think a key-point is that how we always need to have this `if` statement as soon as we need to do something with the current player.
But notice how the code is exactly the same in both if and esle, it is just the playervariables we use that changes.

So lets try again with a different approach:
```js
var curPlayer = app.currentPlayer.get();  // returns 0 or 1   (for player1 or player2..)
var playerObj = players[curPlayer];  // get the Player object for the current player
console.log(playerObj.points);
playerObj.countries.forEach(function(conquered) {
        console.log(conquered.name);
});
```

I think the ability to avoid pasting the same code twice (`if` and `else`) is quite nice,
and it often makes the code shorter and I think easier to overview.
We can try avoiding the repetion with the first approach like this:
```js
var playerid = (app.playerCounter % 2) + 1;  // Adding 1 so we get 1 or 2 instead of 0 or 1
console.log(app["pointsP" + playerid]);
app.playerCountries['player' + playerid].forEach(function(conquered) {
    console.log(conquered.name);
});
```
It works, but imagine doing this everytime we need to do something with the current player
(and don't want to duplicate code with unnecessary if-else(player1/player2) ).
It is much easier to make a typo too, which can lead to bugs. 


I think the changes I did were certainly not absolutely necessary. But I learned some along the way.
I feel like it's a iterative process. You try to restructure a bit and see if it looks better. The
current state is just a part of a process. 

If one would look for the perfect structure of code, I wonder if any app would actually be built at all? =)

A great feat is actually doing stuff and creating an app that does something.
(In comparison it wasn't that hard for me to come in later with a fresh perspective and just change existing code)



PS. I guess the change I doubt the most is the introduction of the EduMap module
(instead of just letting the map functions lay freely in EduMap.js)
We can see what you people think on monday!
