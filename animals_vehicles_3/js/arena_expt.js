/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

File IO, etc
(c) Timo Flesch, 2016/17 


************************************************************************************** */

function exp_saveStimCoords() {
  /*
	saves coordinates of final arrangement of stims 
*/
  for (var ii = 0; ii < board.set.length; ii++) {
    stimIDX = ii + params_exp.numStimuli * (numbers.trialCount - 1);
    stim.coordsFinal[stimIDX] = [
      board.set[ii].attr("x"),
      board.set[ii].attr("y"),
    ];
  }
}

function exp_saveParticipantData() {
  data_arena.pre_trialID = stim.stimVect.trialID;
  data_arena.pre_stimExemplar = stim.stimVect.exemplar;
  data_arena.pre_stimBranchLevel = stim.stimVect.branch;
  data_arena.pre_stimLeafLevel = stim.stimVect.leaf;
  data_arena.pre_stimCoords_Final = stim.coordsFinal;
  data_arena.pre_stimCoords_Orig = stim.coordsOrig;
  data_arena.pre_stimNames = stim.stimNames;
}

function exp_exportData() {
  /*
	exports data to JSON file 
*/

  // first, build data structure
  var data = {
    trialID: stim.stimVect.trialID,
    stimExemplar: stim.stimVect.exemplar,
    stimBranchLevel: stim.stimVect.branch,
    stimLeafLevel: stim.stimVect.leaf,
    stimCoords_Final: stim.coordsFinal,
    stimCoords_Orig: stim.coordsOrig,
    stimNames: stim.stimNames,
  };

  // second, convert data to JSON and send to backend
  $.ajax({
    type: "POST",
    url: "../php/io.php",
    data: {
      json: JSON.stringify(data),
    },
  });
}
