

countryArray = ["Sweden", "Denmark", "Norway", "Finland", "France", "Great Britain", "Germany", "Netherlands"];
country = countryArray[0];

questionsArray = ["Swedenquestion", "Denmarkqustion", "Norwayquestion"];
answerArray = ["Sweden correct", "Denmark correct", "Norway correct"];

gameLoop = true;
while (gameLoop == true) {
	playerChoice = prompt("You are in "+country+", choose where you want to go next");
	//console.log(countryArray.length);


	for (i=0; i<countryArray.length; i++) {
		if (playerChoice == countryArray[i]) {
			answer = prompt("Qustion:"+questionsArray[i]);
			
				if (answer == answerArray[i]){
					
					country = countryArray[i];
				}
				else {
					alert("Game over");
					gameLoop = false;
				}
				
		}
		
	}
	
	
}