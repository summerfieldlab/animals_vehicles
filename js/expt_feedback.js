/* **************************************************************************************

retrieves user feedback from html form
original version: Timo Flesch, 2016
updated version: Timo Flesch, 2021
[timoflesch19@gmail.com]


************************************************************************************** */


var participant_taskNorth_rule  = '';
var participant_taskSouth_rule  = '';


function getHumanFeedback(){
/*
	retrieves values from feedback forms and stores them in global variables
*/


participant_taskNorth_rule  =  $("#userNorthOrchard").val();
participant_taskSouth_rule  =  $("#userSouthOrchard").val();

finishExperiment_data();

}
