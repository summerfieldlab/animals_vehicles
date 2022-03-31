/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Trial Transitions
(c) Timo Flesch, 2016/17 


************************************************************************************** */

function gotoNextTrial(){
/*
	switches to next trial. 
*/
	// save final coordinates
	exp_saveStimCoords();
	// remove all stims
	stims_emptySet();
	// update overall trialCount 
	numbers.trialCount++;
	// add the new set of stims
	stims_fillSet();
	// change colour of aperture depending on context 
	arena_update();
}

function gotoNextTask() {
/*
	saves results and progresses with next task (e.g. in pre-post design)
*/
	exp_saveStimCoords();
	exp_saveParticipantData();
	
	stims_emptySet();
	arena_removeUI();
	finishDissimRatingExperiment();
		
}



