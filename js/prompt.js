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

    swal({
      title: i18n.t("country.name."+code),
      text: i18n.t("country.question."+code),
      type: "input",
      showCancelButton: true,
      closeOnCancel: true,
      confirmButtonText: i18n.t("questionpopup.okbutton"),
      cancelButtonText: i18n.t("questionpopup.cancelbutton"),
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: i18n.t("questionpopup.writeanswer"),
      },
      function(inputValue){ // Called when we press "Ok"
        if (inputValue === false) {
          app.EduMap.deselectCountry(code);
          return false;
        }
        if (inputValue === "") {
          swal.showInputError("You need to write something!");
          return false;
        }
        // removed country < 3 req. 
        if(inputValue === country.answer){

          console.log("Correct answer.");
          swal(i18n.t("questionpopup.correctanswer"), i18n.t("questionpopup.youwrote") + inputValue + "  " + i18n.t("questionpopup.points") + country.points, "success");

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
          swal.showInputError(i18n.t("questionpopup.incorrectanswer") + (2 - counter) + i18n.t("questionpopup.triesleft"));
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
            swal(i18n.t("questionpopup.notriesleft"));
            //swal("No tries left!", "error");
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