/*
Timo Flesch, 2016 [timo.flesch@gmail.com]
*/
// START
function startTraining() {
  coding.training.started = true
  coding.training.instructions = trainingInstructions()
  board.training   = {}
  jwerty.key('→',handleTrainingForward);
  jwerty.key('←',handleTrainingBackward);
  updateTraining();
}

function finishTraining() {
  coding.training.finished = true
  clearTimeout(coding.timeout)
  boardRemoveTraining()
  screenResponse()
}
// MOVE BACKWARD / FORWARD
function handleTrainingForward()  { handleTrainingClick(false) }
function handleTrainingBackward() { handleTrainingClick(true)  }
function handleTrainingClick(backward) {
  if (!coding.training.started) { return }
  if (coding.training.finished) { return }
  if (coding.training.wait)     { return }
  if (backward) { coding.training.index-- } else { coding.training.index++ }
  updateTraining();
  coding.training.wait = true;
}
function interTraining() {
  if(coding.training.finished) { return }
  coding.training.wait = false
  boardCreateTrainingNext()
}

// UPDATE TRAINING SCREEN
function updateTraining() {
  if (coding.training.finished) { return }
  if (coding.training.index<0)  { coding.training.index = 0 }
  // apply instructions
  var i = coding.training.index
  var f = coding.training.instructions[i].func
  var a = coding.training.instructions[i].args
  boardRemove(); f(a)
  coding.timeout = setTimeout(interTraining,parameters.training_wait);
}
