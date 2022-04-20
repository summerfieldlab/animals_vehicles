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
    arena_stims.coordsFinal[stimIDX] = [
      board.set[ii].attr("x"),
      board.set[ii].attr("y"),
    ];
  }
}

function exp_saveParticipantData() {
  data_arena.arena_trialID = arena_stims.stimVect.trialID;
  data_arena.arena_stimExemplar = arena_stims.stimVect.exemplar;
  data_arena.arena_stimSizeLevel = arena_stims.stimVect.size;
  data_arena.arena_stimSpeedLevel = arena_stims.stimVect.speed;
  data_arena.arena_stimDomain = arena_stims.stimVect.domain;
  data_arena.arena_stimDomIDX = arena_stims.stimVect.dom_idx;
  data_arena.arena_stimCoords_Final = arena_stims.coordsFinal;
  data_arena.arena_stimCoords_Orig = arena_stims.coordsOrig;
  data_arena.arena_stimNames = arena_stims.stimNames;
}

function exp_exportData() {
  /*
	exports data to JSON file 
*/

  // first, build data structure
  var data = {
    trialID: arena_stims.stimVect.trialID,
    stimExemplar: arena_stims.stimVect.exemplar,
    stimSizeLevel: arena_stims.stimVect.size,
    stimSpeedLevel: arena_stims.stimVect.speed,
    stimCoords_Final: arena_stims.coordsFinal,
    stimCoords_Orig: arena_stims.coordsOrig,
    stimNames: arena_stims.stimNames,
    taskids: arena_stims.trial_id,
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
