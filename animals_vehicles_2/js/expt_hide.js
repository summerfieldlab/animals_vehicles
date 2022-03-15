/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/*
Timo Flesch [timoflesch19 [at] gmail [dot] com]
*/
// <!-- Hide methods -->
function hideTrial() {
  hideFixation(board.fixation);
  hideStimuli();
  hideBlurCue();
  hideCue();
  // hideInstructions();
  // hideClock();
}

function hideCue() {
  board.cue.object.attr({ opacity: 0 });
  board.cue.context.attr({ opacity: 0 });
  // board.cue.text.attr({"opacity":0});
}

function hideBlurCue() {
  board.blurcue.object.attr({ opacity: 0 });
  board.blurcue.context.attr({ opacity: 0 });
  // board.cue.text.attr({"opacity":0});
}

function hideStimuli() {
  board.stimuli.stimulus.image.attr({ opacity: 0 });
  board.stimuli.stimulus.frame.attr({ opacity: 0 });
}

function hideKeys() {
  board.instructions.keys[0].attr({ opacity: 0 });
  board.instructions.keys[1].attr({ opacity: 0 });
}

function hideInstructions() {
  board.instructions.object.attr({ opacity: 0 });
}

function hideFeedback() {
  board.leftfeedback.object.attr({ opacity: 0 });
  board.rightfeedback.object.attr({ opacity: 0 });
  board.leftfeedback.rect.attr({ opacity: 0 });
  board.rightfeedback.rect.attr({ opacity: 0 });
}

function hideBlock() {
  board.block.object.remove();
}
