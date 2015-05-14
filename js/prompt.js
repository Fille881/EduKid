function swalPrompt(regionName, code){
  'use strict';
    var currentAnswer;

    // Filter out the country with the selected region name
    var country = app.countries.filter(function(country) {
      return country.name == regionName;
    })[0]; // Get the first element, it will only be one

    var counter;
    if (!app.tries[country.name]){
       counter = 0;
    }
    else{
      counter = app.tries[country.name];
      console.log(counter);
    } 

    var curPlayer = app.currentPlayer.get();

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
          // removed country < 3 req. 
          if(inputValue === country.answer){

            console.log("Correct answer.");
            swal("Nice!", "You wrote: " + inputValue + "Points: " + country.points, "success");

            var playerObj = app.players[curPlayer];
            playerObj.addpoints(country.points); // might need parseint here
            playerObj.addcountry(regionName, country.points, country.code);
            showConqueredCountries(playerObj);

          	if (curPlayer === 0) {
            	 app.EduMap.regionColorOnAnswer(country, app.palette[0]);
          	} else {
            	 app.EduMap.regionColorOnAnswer(country, app.palette[3]);
            }

            counter++;
            app.tries[country.name] = counter;

          }else { //counter < 2) wrong answer
            swal.showInputError("Incorrect answer! " + (2 - counter) + " tries left.");
            counter++;
            console.log(country.name + ": " + counter);
            app.tries[country.name] = counter;
            if (curPlayer === 0){ // color country with wrong color
	            	app.EduMap.regionColorOnAnswer(country, app.palette[1]);
            		}
            		else{
	            		app.EduMap.regionColorOnAnswer(country, app.palette[4]);
            		}

            if (counter > 2) { // color country with 'too late' color
              app.tries[country.name] = 10; //or whatever
              swal("No tries left!", "error");
              if (curPlayer === 0){
              app.EduMap.regionColorOnAnswer(country, app.palette[2]);
              console.log("P1 wrong: " + app.palette[2]);
              } else {
                app.EduMap.regionColorOnAnswer(country, app.palette[5]);
              }
              endturn();
            }

          }
      });

    }
}