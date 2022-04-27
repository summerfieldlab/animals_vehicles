
/* **************************************************************************************

Shows instructions via html injection
(c) Timo Flesch, 2016 [timo.flesch@gmail.com]
Summerfield Lab, Experimental Psychology Department, University of Oxford

************************************************************************************** */

var startedinstructions  = false;
var finishedinstructions = false;
var pageIDX      = 0;
var inStruct     = [];
inStruct.cap     = []; // caption/headline
inStruct.txt     = []; // content
inStruct.img     = []; // illustration

//setInstructions(); 

function setInstructions(taskID) {
/*
	here I define my instructions
*/
	// get file prefix 
	imfile_prefix = params_exp.stimtype[0] + params_exp.feature[0] + "_";

	pageIDX      = 0;

	inStruct.cap     = []; // caption/headline
	inStruct.txt     = []; // content
	inStruct.img     = []; // illustration
	// welcome (suboptimal, as I define this also in the html)
	inStruct.txt[0]     = "<br> You'll now receive detailed instructions for the experiment. <br> Please use the buttons below to navigate through these instructions."
	inStruct.img[0]     = [];

	// basics
	inStruct.txt[1]     = "In this experiment, you'll see images of  "  + params_exp.stimtype + "s and have to decide how " + params_exp.feature + " they are. <br> <br> You report your decision by clicking on a 5-point rating scale (going from one extreme to the other). <br> You can't skip trials. In other words, the 'next trial' button only takes you to the next trial once you've rated the current image. <br> If you're unsure, try to make your best guess."
	inStruct.img[1]     =  params_exp.instr_dir + imfile_prefix +  "1.png";
	
	// make selection
	inStruct.txt[2]     = "You can provide a rating by clicking on one of the five white dots on the rating scale. <br> Use the LEFT mouse button to provide a response. <br> On a touchscreen device, just tap on the white dot you'd like to select."
	inStruct.img[2]     = params_exp.instr_dir + imfile_prefix +  "2.png";

	// change mind
	inStruct.txt[3]     = "If you're unhappy with your choice, click on a different white dot to select it instead."
	inStruct.img[3]     = params_exp.instr_dir + imfile_prefix +  "3.png";

	// next trial button
	inStruct.txt[4]    = "Once you're satisfied with your decision, click on the 'next trial' button to move on to the next trial.<br><br> Remember that you must provide a response before you're able continue!";
	inStruct.img[4]    = params_exp.instr_dir + imfile_prefix +  "4.png";

	// next trial
	inStruct.txt[5]    = "Once you've pressed the next trial button, you'll see a new item and rating scale. <br> You'll have to complete " + params_exp.n_trials + " trials in total.";

	inStruct.img[5]    = params_exp.instr_dir + imfile_prefix +  "5.png";

	// summary
	inStruct.txt[6]    = "1. In this task, you'll see different images of " + params_exp.stimtype + "s and have to report how " + params_exp.feature +  " they are. <br><br> 2. On each trial, you'll see an image and a 5-point rating scale. <br><br> 3. You provide a response by clicking on an item on that scale. <br><br> 4. Click on the next trial button to continue to the next trial.<br><br> 5. You'll have to provide " + params_exp.n_trials + " ratings in total.<br><br><br> Good Luck!";
	inStruct.img[6] = [];
	

}




function gotoNextPage() {
/*
	changes div to next entry in instruction array
*/
	// move forward
	pageIDX++;
	changeInstructions();
	changeButtons();
}

function gotoPrevPage() {
/*
	changes div to previous entry in instruction array
*/
	// move backward
	pageIDX--;
	changeInstructions();
	changeButtons();
}


function changeInstructions() {
/*
	changes div content via html injection
*/
	
	$('.bodyText').html(inStruct.txt[pageIDX]);
	if (inStruct.img[pageIDX].length>0) {
		$('.bodyImg').html("<img id=instr_img src=" + inStruct.img[pageIDX] + ">");
	}
	else 
		$('.bodyImg').html("<!-- nothing to see here -->");
}


function changeButtons() {
/*
	changes properties of buttons 
*/
	console.log(pageIDX)

	if (pageIDX == 0) {	
		$('#prevButton').prop('disabled', true);
	}
	else {
		$('#prevButton').prop('disabled', false);
	}

	if (pageIDX == inStruct.txt.length-2) { 		
 		$('#nextButton').text('Next Page');
 		$('#nextButton').off('click');
 		$('#nextButton').attr('onclick',"gotoNextPage()");
 		$('.buttonBox#nextButton').css('background-color','rgba(249,167,50,1)');
 	}
	if (pageIDX == inStruct.txt.length-1) { 		
 		$('#nextButton').text('Start');
 		$('#nextButton').off('click');
	
		$('#nextButton').attr('onclick',"goWebsite(html_likert);startExperiment()");
 		

 		$('.buttonBox#nextButton').css('background-color','red');
 	}
}
