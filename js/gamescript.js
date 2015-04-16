

var countryArray = ["Sweden", "Denmark", "Norway", "Finland", "France", "Great Britain", "Germany", "Netherlands"];
var country = countryArray[0];

var questionsArray = ["Swedenquestion", "Denmarkqustion", "Norwayquestion"];
var answerArray = ["Sweden correct", "Denmark correct", "Norway correct"];

var gameLoop = true;
while (gameLoop === true) {
	var playerChoice = prompt("You are in " + country + ", choose where you want to go next");
	//console.log(countryArray.length);
	for (i = 0; i < countryArray.length; i++) {
		if (playerChoice === countryArray[i]) {
			var answer = prompt("Qustion:" + questionsArray[i]);
				if (answer === answerArray[i]) {
				country = countryArray[i];
				}
				else {
					alert("Game over");
					gameLoop = false;
				}
		}
	}
}