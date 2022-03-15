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
      keyIMGs[0] = board.paper.object.image(
        [parameters.keyURL + "arrow_" + "left" + "_alpha_reject.png"],
        board.paper.centre[0] -
          parameters.visuals.size.stim[0] / 2 -
          parameters.visuals.size.keyIMG[0] -
          parameters.visuals.width.keyIMGoffset -
          parameters.visuals.width.keyframe,
        board.paper.centre[1] - parameters.visuals.size.keyIMG[1] / 2,
        parameters.visuals.size.keyIMG[0],
        parameters.visuals.size.keyIMG[1]
      );
      keyIMGs[1] = board.paper.object.image(
        [parameters.keyURL + "arrow_" + "right" + "_alpha_accept.png"],
        board.paper.centre[0] +
          parameters.visuals.size.stim[0] / 2 +
          parameters.visuals.width.keyIMGoffset,
        board.paper.centre[1] - parameters.visuals.size.keyIMG[1] / 2,
        parameters.visuals.size.keyIMG[0],
        parameters.visuals.size.keyIMG[1]
      );
      break;
    case 1:
      keyIMGs[0] = board.paper.object.image(
        [parameters.keyURL + "arrow_" + "left" + "_alpha_accept.png"],
        board.paper.centre[0] -
          parameters.visuals.size.stim[0] / 2 -
          parameters.visuals.size.keyIMG[0] -
          parameters.visuals.width.keyIMGoffset,
        board.paper.centre[1] - parameters.visuals.size.keyIMG[1] / 2,
        parameters.visuals.size.keyIMG[0],
        parameters.visuals.size.keyIMG[1]
      );
      keyIMGs[1] = board.paper.object.image(
        [parameters.keyURL + "arrow_" + "right" + "_alpha_reject.png"],
        board.paper.centre[0] +
          parameters.visuals.size.stim[0] / 2 +
          parameters.visuals.width.keyIMGoffset,
        board.paper.centre[1] - parameters.visuals.size.keyIMG[1] / 2,
        parameters.visuals.size.keyIMG[0],
        parameters.visuals.size.keyIMG[1]
      );
      break;
  }
  return keyIMGs;
}

function drawChoiceRect(scrSide) {
  /*
			 draws rectangle around choosen option
	
		*/

  switch (scrSide) {
    case "right":
      rect = drawRect(board.paper.object, [
        board.paper.centre[0] +
          parameters.visuals.size.stim[0] / 2 +
          parameters.visuals.width.keyIMGoffset,
        board.paper.centre[1] - parameters.visuals.size.keyIMG[1] / 2,
        80,
        80,
      ]);

      rect.attr({ "stroke-width": parameters.visuals.width.keyframe });
      break;
    case "left":
      rect = drawRect(board.paper.object, [
        board.paper.centre[0] -
          parameters.visuals.size.stim[0] / 2 -
          parameters.visuals.size.keyIMG[0] -
          parameters.visuals.width.keyIMGoffset -
          parameters.visuals.width.keyframe,
        board.paper.centre[1] - parameters.visuals.size.keyIMG[1] / 2,
        80,
        80,
      ]);
      rect.attr({ "stroke-width": parameters.visuals.width.keyframe });
      break;
  }
  return rect;
}

function drawStimulus(stimulusName) {
  /*
	draws the stimulus 
*/
  stimulus = {};
  stimulus.image = board.paper.object
    .image(
      parameters.stimURL.concat(stimulusName),
      board.paper.centre[0] - parameters.visuals.size.stim[0] / 2,
      board.paper.centre[1] - parameters.visuals.size.stim[1] / 2,
      parameters.visuals.size.stim[0],
      parameters.visuals.size.stim[1]
    )
    .attr({ opacity: 0 });
  stimulus.frame = drawRect(board.paper.object, [
    board.paper.centre[0] - parameters.visuals.size.stim[0] / 2,
    board.paper.centre[1] - parameters.visuals.size.stim[1] / 2,
    parameters.visuals.size.stim[0],
    parameters.visuals.size.stim[1],
  ]).attr({ "stroke-width": parameters.visuals.width.stimframe });
  return stimulus;
}

function drawShop(shopName, blurOrNot) {
  /*
	draws orchard, either blurred or not blurred
*/
  if (blurOrNot) {
    board.blurcue.object = board.paper.object
      .image(
        parameters.shopURL.concat(shopName),
        board.paper.centre[0] - parameters.visuals.size.shop[0] / 2,
        board.paper.centre[1] - parameters.visuals.size.shop[1] / 2,
        parameters.visuals.size.shop[0],
        parameters.visuals.size.shop[1]
      )
      .attr({ opacity: 0 });
    board.blurcue.object.blur(parameters.visuals.blurlvl);
    board.blurcue.context = drawRect(board.paper.object, [
      board.paper.centre[0] - parameters.visuals.size.shop[0] / 2,
      board.paper.centre[1] - parameters.visuals.size.shop[1] / 2,
      parameters.visuals.size.shop[0],
      parameters.visuals.size.shop[1],
    ]);
    board.blurcue.context.attr({ stroke: "black", "stroke-width": 2 });
  } else {
    board.cue.object = board.paper.object
      .image(
        parameters.shopURL.concat(shopName),
        board.paper.centre[0] - parameters.visuals.size.shop[0] / 2,
        board.paper.centre[1] - parameters.visuals.size.shop[1] / 2,
        parameters.visuals.size.shop[0],
        parameters.visuals.size.shop[1]
      )
      .attr({ opacity: 0 });
    board.cue.context = drawRect(board.paper.object, [
      board.paper.centre[0] - parameters.visuals.size.shop[0] / 2,
      board.paper.centre[1] - parameters.visuals.size.shop[1] / 2,
      parameters.visuals.size.shop[0],
      parameters.visuals.size.shop[1],
    ]);
    board.cue.context.attr({ stroke: "black", "stroke-width": 2 });
  }
}
