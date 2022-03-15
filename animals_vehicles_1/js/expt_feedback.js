/* **************************************************************************************

retrieves user feedback from html form
original version: Timo Flesch, 2016
updated version: Timo Flesch, 2021
[[timoflesch19 [at] gmail [dot] com]]


************************************************************************************** */


var participant_taskBlue_rule = '';
var participant_taskOrange_rule = '';


function getHumanFeedback() {
	/*
		retrieves values from feedback forms and stores them in global variables
	*/


	participant_taskBlue_rule = $("#userBlueShop").val();
	participant_taskOrange_rule = $("#userOrangeShop").val();

	finishExperiment_data();

}
