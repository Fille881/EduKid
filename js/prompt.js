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
	  html:true,
      title: i18n.t("country.name."+code),
//       text: i18n.t("country.question."+code) + '<br>' + '<button class="answer confirm" id="answer1"> ' + country["answer"] + '</button>' + '<br>' + '<button class="answer confirm" id=answer-2> ' + country["answer-2"] + '</button>' + '<br>' + '<button class="answer confirm"  id=answer-3> ' + country["answer-3"] + '</button>',
     type: "input",
      showCancelButton: true,
      closeOnCancel: true,
      showConfirmButton: true,
    confirmButtonText: i18n.t("questionpopup.okbutton"),
      cancelButtonText: i18n.t("questionpopup.cancelbutton"),
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Write your answer here" ,
      },
      function(inputValue){// Called when we press "Ok"
	     // console.log(buttonClicked);
       console.log("Correct answer.");
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
          swal(i18n.t("questionpopup.correctanswer"), i18n.t("questionpopup.youwrote") + inputValue + "  " + i18n.t("questionpopup.points") + country.points, "success");

          var playerObj = app.players[curPlayer];
          playerObj.addpoints(country.points); // might need parseint here
          playerObj.addcountry(regionName, country.points, country.code);
          showConqueredCountries(playerObj); // <- we render the whole countrylist again

          // Now we want to modify the newly added country on the page, to animate it
          $("#" + regionName).addClass('anim-invisible'); // <-- makes element invisible
          // this means: call this function in 0 milliseconds(but after the rest of the code has run)
          setTimeout(function () { 
            $("#" + regionName).addClass('load'); // fade it in!
          }, 0);

        
        	if (curPlayer === 0) {
          	 regionColorOnAnswer(country, app.palette[0]);
        	} else {
            $("#" + regionName).addClass('anim-from-left');
          	 regionColorOnAnswer(country, app.palette[3]);
          }

          counter++;
          app.tries[country.name] = counter;

        }else { //counter < 2) wrong answer
          swal.showInputError(i18n.t("questionpopup.incorrectanswer") + (2 - counter) + i18n.t("questionpopup.triesleft"));
          counter++;
          console.log(country.name + ": " + counter);
          app.tries[country.name] = counter;
          if (curPlayer === 0){ // color country with wrong color
            	regionColorOnAnswer(country, app.palette[1]);
          		}
          		else{
            		regionColorOnAnswer(country, app.palette[4]);
          		}

          if (counter > 2) { // color country with 'too late' color
            app.tries[country.name] = 10; //or whatever
            swal(i18n.t("questionpopup.notriesleft"));
            //swal("No tries left!", "error");
            if (curPlayer === 0){
            regionColorOnAnswer(country, app.palette[2]);
            console.log("P1 wrong: " + app.palette[2]);
            } else {
              regionColorOnAnswer(country, app.palette[5]);
            }
            endturn();
          }

        }
    });

    
}