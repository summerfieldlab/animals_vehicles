
/* **************************************************************************************

Shows instructions via html injection
(c) Timo Flesch, 2016 [timo.flesch@gmail.com]


************************************************************************************** */

var startedinstructions  = false;
var finishedinstructions = false;
var pageIDX      = 0;
var inStruct     = [];
inStruct.cap     = []; // caption/headline
inStruct.txt     = []; // content
inStruct.img     = []; // illustration

setInstructions(); 

function setInstructions() {
/*
	here I define my instructions
*/
	
	// welcome (suboptimal, as I define this also in the html)
	inStruct.txt[0]     = " Hi! <br> Thanks for taking part in this experiment! <br> Please use the buttons below to navigate through the instructions."
	inStruct.img[0]     = [];

	// north orchard
	inStruct.txt[1]     = "Imagine that you are a gardener. <br> You own two orchards.<br>The first one is the <b>north orchard</b> <br>"
    inStruct.img[1]     =  "instr/instr_orchard_north.png";
	
    // south orchard
    inStruct.txt[2]     = "And the second one is the <b>south orchard</b> <br>"
    inStruct.img[2]     =  "instr/instr_orchard_south.png";
	
	// what to do
	inStruct.txt[3]     = "<b>You would like to plant some trees in those gardens.</b><br><br>However, you don't know yet which trees grow best in those gardens.<br>The only thing you know is that you need different types of trees for both gardens.<br><br><b>Your task is to figure out which trees grow in each garden and to plant exactly those trees in order to maximize your reward."
	inStruct.img[3]    = "";

	// trial - context
	inStruct.txt[4]     = "Each trial begins with an image of the garden you're currently in."
	inStruct.img[4]     = "instr/instr_orchard_south.png"

	// trial - stimulus
	inStruct.txt[5]     = "Shortly after, an image of a tree appears, together with the key assignment.<br> you'll use the same buttons throughout the entire experiment!"
	inStruct.img[5]     =  "instr/instr_stim_disp_south.png"

	// trial - decision
	inStruct.txt[6]     = "You decide whether you want to plant the tree or not.<br>To communicate your decision, you press either the left or right arrow key."
	inStruct.img[6]     = "instr/instr_resp_choice.png";

	// trial - feedback 1
	inStruct.txt[7]     = " Right after you've pressed a button, we'll either put the tree in the garden or show an empty orchard.<br> Let's assume that you decided to plant the tree!"
	inStruct.img[7]     = "instr/instr_stim_choice_plant_south.png" 

	// trial - feedback 2
	inStruct.txt[8]    = "After a short delay, you'll receive your reward/penalty. <br>This indicates if your choice was good or bad"
	inStruct.img[8]    = "instr/instr_stim_fb_neg_south.png" 

	// trial - feedback 3
	inStruct.txt[9]    = "In the top half of the image, you see two numbers. <br> These are the rewards/penalties. <br> You always receive 0 reward for not planting a tree...";
	inStruct.img[9]    = "instr/instr_stim_fb_neg_south_vals_reject.png" //TODO change, this is a placeholder

	// trial - feedback 4
	inStruct.txt[10]    = "..and either a reward or a penalty for planting a tree. <br> The value ranges from -50 to +50";
	inStruct.img[10]    = "instr/instr_stim_fb_neg_south_vals_accept.png" //TODO change, this is a placeholder

	// trial - feedback 5
	inStruct.txt[11]    = "Also, if you decide to plant the tree, it either shrinks or grows, depending on your choice.<br> Remember: You want to receive rewards and thus plant trees that grow nicely!";
	inStruct.img[11]    = "instr/instr_stim_fb_neg_south_tree_shrink.png" //TODO change, this is a placeholder

	// reminder
	inStruct.txt[12]    = "You need to learn which trees give you a large reward, and which trees give you a large penalty. <br>Plant those trees that give you a reward! <br> Avoid the other trees!";
	inStruct.img[12]    = ""; 

    // structure
    inStruct.txt[13]    ="There will be a TRAINING PHASE and a TEST PHASE. <br> You'll receive feedback only during the training phase <br> The training phase consists of two blocks and the test phase of one block. <br>All the blocks are of equal length.<br>There will be breaks between every block. <br>"
    inStruct.img[13]    = [];
	// summary
	inStruct.txt[14]   = "<p><b> SUMMARY </b> <br>1. There are two gardens <br>2. Different types of trees grow best in each garden<br>3. Figure out which trees to plant and which trees to avoid<br>4. Maximize your reward!<br></p>";
	inStruct.img[14]   = [];


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
 		$('#nextButton').attr('onclick',"startExperiment()");
 		$('.buttonBox#nextButton').css('background-color','red');
 	}
}
