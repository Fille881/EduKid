

var countryArray = ["Sweden", "Denmark", "Norway", "Finland", "France", "Great Britain", "Germany", "Netherlands"];
var country = countryArray[0];

var questionsArray = ["Swedenquestion", "Denmarkqustion", "Norwayquestion"];
var answerArray = ["Sweden correct", "Denmark correct", "Norway correct"];
var questionArray2 = {sweden:"What is the capital of Sweden", denmark:"Does lego come from Denmark?", norway:"What currency does Norway use?"};



/*
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
*/

$( document ).ready(function() {


var questionArray2 = {sweden:"What is the capital of Sweden", denmark:"Does lego come from Denmark?", norway:"What currency does Norway use?"};
var answerArray2 = {sweden:"Stockholm", denmark:"Yes", norway:"Kronor"};


	$(".btn").click(function(){
		
		if ($( ".btn" ).hasClass( "btn-default" )){
			var selectedCountry = this.id;
			var question = questionArray2[selectedCountry];
			var answer = prompt(question);
			
				if (answer === answerArray2[selectedCountry]){
					
					$(this).removeClass( "btn-default" );
					$(this).addClass( "btn-primary" );
				
				}
				else{
					alert("Wrong answer, try again");
					
				}
			
		}
	
	});
})





