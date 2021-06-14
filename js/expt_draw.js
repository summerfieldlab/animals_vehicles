/* **************************************************************************************

Draws raphael objects
original version: Timo Flesch, 2016
updated version: Timo Flesch, 2021
[timoflesch19@gmail.com]


************************************************************************************** */
function drawKeys(keyAssign) {
	/*
		draws response keys during stim presentation
	*/
		keyIMGs = [];
		switch (keyAssign) {
			case 0:
				// keyIMGs[0] = board.paper.object.image([parameters.keyURL + 'arrow_' + 'left' +	 '_alpha_reject.png'],board.paper.centre[0]-88,board.paper.centre[1]-175,parameters.visuals.size.keyIMG[0],parameters.visuals.size.keyIMG[1]);
				// keyIMGs[1] = board.paper.object.image([parameters.keyURL + 'arrow_' + 'right' + '_alpha_accept.png'],board.paper.centre[0]+14,board.paper.centre[1]-175,parameters.visuals.size.keyIMG[0],parameters.visuals.size.keyIMG[1]);
				keyIMGs[0] = board.paper.object.image([parameters.keyURL + 'arrow_' + 'left' +	 '_alpha_reject.png'],board.paper.centre[0]-parameters.visuals.size.stim[0]/2-parameters.visuals.size.keyIMG[0],board.paper.centre[1]-parameters.visuals.size.keyIMG[1]/2,parameters.visuals.size.keyIMG[0],parameters.visuals.size.keyIMG[1]);
				keyIMGs[1] = board.paper.object.image([parameters.keyURL + 'arrow_' + 'right' + '_alpha_accept.png'],board.paper.centre[0]+parameters.visuals.size.stim[0]/2,board.paper.centre[1]-parameters.visuals.size.keyIMG[1]/2,parameters.visuals.size.keyIMG[0],parameters.visuals.size.keyIMG[1]);
				break;
			case 1:
				keyIMGs[0] = board.paper.object.image([parameters.keyURL + 'arrow_' + 'left' + '_alpha_accept.png'],board.paper.centre[0]-parameters.visuals.size.stim[0]/2-parameters.visuals.size.keyIMG[0],board.paper.centre[1]-parameters.visuals.size.keyIMG[1]/2,parameters.visuals.size.keyIMG[0],parameters.visuals.size.keyIMG[1]);
				keyIMGs[1] = board.paper.object.image([parameters.keyURL + 'arrow_' + 'right' + '_alpha_reject.png'],board.paper.centre[0]+parameters.visuals.size.stim[0]/2,board.paper.centre[1]-parameters.visuals.size.keyIMG[1]/2,parameters.visuals.size.keyIMG[0],parameters.visuals.size.keyIMG[1]);
				break;
		}
		return keyIMGs;
	
	}
	
	
	function drawChoiceRect(scrSide) {
		/*
			 draws rectangle around choosen option
	
		*/
	
		switch (scrSide) {
			case 'right':
				// rect = drawRect(board.paper.object,[board.paper.centre[0]+12,board.paper.centre[1]-180,80,80]);
				rect = drawRect(board.paper.object,[board.paper.centre[0]+parameters.visuals.size.stim[0]/2,board.paper.centre[1]-parameters.visuals.size.keyIMG[1]/2,80,80]);
	
				rect.attr({"stroke-width":4});
				break;
			case 'left':
				// rect = drawRect(board.paper.object,[board.paper.centre[0]-90,board.paper.centre[1]-180,80,80]);
				rect = drawRect(board.paper.object,[board.paper.centre[0]-parameters.visuals.size.stim[0]/2-parameters.visuals.size.keyIMG[0],board.paper.centre[1]-parameters.visuals.size.keyIMG[1]/2,80,80]);
				rect.attr({"stroke-width":4});
				break;
		}
		return rect;
	}
	

function drawTree(treeName) {
/*
	draws the stimulus 
*/
	stimulus = {}
	stimulus.image = board.paper.object.image(parameters.stimURL.concat(treeName),board.paper.centre[0]-parameters.visuals.size.stim[0]/2,board.paper.centre[1]-parameters.visuals.size.stim[1]/2,parameters.visuals.size.stim[0],parameters.visuals.size.stim[1]).attr({"opacity": 0});
	stimulus.frame = drawRect(board.paper.object,[board.paper.centre[0]-parameters.visuals.size.stim[0]/2,board.paper.centre[1]-parameters.visuals.size.stim[1]/2,parameters.visuals.size.stim[0],parameters.visuals.size.stim[1]]).attr({'stroke-width':4}) 
  	return stimulus

}




function drawGarden(gardenName,blurOrNot) {
/*
	draws orchard, either blurred or not blurred
*/
  if (blurOrNot) {
	board.blurcue.object = board.paper.object.image(parameters.shopURL.concat(gardenName),board.paper.centre[0]-parameters.visuals.size.garden[0]/2,board.paper.centre[1]-parameters.visuals.size.garden[1]/2,parameters.visuals.size.garden[0],parameters.visuals.size.garden[1]).attr({"opacity":0});
	board.blurcue.object.blur(parameters.visuals.blurlvl);
	board.blurcue.context = drawRect(board.paper.object,[board.paper.centre[0]-parameters.visuals.size.garden[0]/2,board.paper.centre[1]-parameters.visuals.size.garden[1]/2,parameters.visuals.size.garden[0],parameters.visuals.size.garden[1]]);
  	board.blurcue.context.attr({stroke:"black","stroke-width":2});
  }
  else {
	board.cue.object = board.paper.object.image(parameters.shopURL.concat(gardenName),board.paper.centre[0]-parameters.visuals.size.garden[0]/2,board.paper.centre[1]-parameters.visuals.size.garden[1]/2,parameters.visuals.size.garden[0],parameters.visuals.size.garden[1]).attr({"opacity":0});
	board.cue.context = drawRect(board.paper.object,[board.paper.centre[0]-parameters.visuals.size.garden[0]/2,board.paper.centre[1]-parameters.visuals.size.garden[1]/2,parameters.visuals.size.garden[0],parameters.visuals.size.garden[1]]);
  	board.cue.context.attr({stroke:"black","stroke-width":2});

  }

}


