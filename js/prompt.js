function swalPrompt(regionName, code){
  'use strict';
    var currentAnswer;

    // Filter out the country with the selected region name
    var country = app.countries.filter(function(country) {
      return country.name == regionName;
    })[0]; // Get the first element, it will only be one
    if (!app.tries[country.name]){
       var counter = 0;
    }
    else{
      counter = app.tries[country.name];
      console.log(counter);
    } 

    if (country) {
      swal({
        title: country.name,
        text: country.question,
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Write your answer"
        },
        function(inputValue){ // Called when we press "Ok"
          if (inputValue === false) {
            deselectCountry(code);
            return false;
          }
          if (inputValue === "") {
            swal.showInputError("You need to write something!");
            return false;
          }
          if(inputValue === country.answer && counter < 3){
            console.log("Correct answer.");
            swal("Nice!", "You wrote: " + inputValue + "Points: " + country.points, "success");
            
            if (app.pointsToDiv == "player1"){
	           	app.pointsP1 = app.pointsP1 + parseInt(country.points); 
	           	app.playerCountries.player1[regionName] = {
		           	name: regionName,
		           	points: country.points,
		           	code: country.code,
	           	};
    			   	playerSelected(app.playerCounter);
    			   	var countryCode = country.code;
    			   	showConqueredCountries(app.playerCounter);
			   	
			   	
			   				
	            }
	            else{
		           app.pointsP2 = app.pointsP2 + parseInt(country.points); 
              app.playerCountries.player2[regionName] = {
                name: regionName,
                points: country.points,
                code: country.code,
              };
              playerSelected(app.playerCounter);
              var countryCode = country.code;
              showConqueredCountries(app.playerCounter);
	            }
            
            	if (app.pointsToDiv == "player1"){
	            	regionColorOnAnswer(country, app.palette[0]);
            		}
            		else{
	            		regionColorOnAnswer(country, app.palette[3]);
	            		}
            counter++;
            app.tries[country.name] = counter;
          }else if(inputValue != country.answer && counter < 2){
            swal.showInputError("Incorrect answer! " + (2 - counter) + " tries left.");
            counter++;
            console.log(country.name + ": " + counter);
            app.tries[country.name] = counter;
            if (app.pointsToDiv == "player1"){
	            	regionColorOnAnswer(country, app.palette[1]);
            		}
            		else{
	            		regionColorOnAnswer(country, app.palette[4]);
            			}
          }else if(counter === 2){
             counter += 2;
            app.tries[country.name] = counter;
            swal("No tries left!", "error");

            if (app.pointsToDiv == "player1"){
	            regionColorOnAnswer(country, app.palette[2]);
              console.log("P1 wrong: " + app.palette[2]);
            }else{
          		regionColorOnAnswer(country, app.palette[5]);
        		}
            changeBGcolor();            
            app.playerCounter++;
            playerSelected(app.playerCounter);
          }
      });

    }
}