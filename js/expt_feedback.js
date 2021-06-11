/* **************************************************************************************

retrieves user feedback from html form
(c) Timo Flesch, 2016 [timo.flesch@gmail.com]


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
