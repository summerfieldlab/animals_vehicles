/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/*
Timo Flesch [timoflesch19 [at] gmail [dot] com]
*/

function removeStimuli() {
  board.stimuli.stimulus.image.remove();
  board.stimuli.stimulus.frame.remove();
}
function removeInstructions() {
  // board.instructions.object.remove();
}
function removeFeedback() {
  board.leftfeedback.object.remove();
  board.leftfeedback.rect.remove();
  board.rightfeedback.object.remove();
  board.rightfeedback.rect.remove();
}
function removePaper() {
  board.paper.object.remove();
}

function removeCue() {
  board.cue.object.remove();
  board.cue.context.remove();
}

function removeBlurCue() {
  board.blurcue.object.remove();
  board.blurcue.context.remove();
}

function removeKeys() {
  board.instructions.keys[0].remove();
  board.instructions.keys[1].remove();
}
