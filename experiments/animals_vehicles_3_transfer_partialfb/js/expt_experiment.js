/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function startDissimRatingExperiment() {
  // clean div
  goWebsite(html_dissim);
  finishedinstructions = true;
  startedinstructions = false;
  starteddissimjudge = true;
  finisheddissimjudge = false;

  // run the experiment
  runDissimJudgeExp();
}

function startMainExperiment() {
  finishedinstructions = true;
  startedinstructions = false;
  setExperiment(); //expt_parameters.js
  edata.exp_starttime = getTimestamp();

  newExperiment();
}

function newExperiment() {
  // clean div
  goWebsite(html_task);
  // set flags
  startedexperiment = true;
  finishedexperiment = false;
  // run the experiment
  runExperiment(); //expt_run.js
}

function finishDissimRatingExperiment() {
  //saveExperiment(); // i think uncommenting this leads to the occasional remaining file in tmp, if calls asynchronous
  starteddissimjudge = false;
  finisheddissimjudge = true;
  startedinstructions = false;
  finishedinstructions = true;

  finishExperiment_data(); //saves data and continues with payment
}

function finishMainExperiment() {
  saveExperiment();
  startedexperiment = false;
  finishedexperiment = true;
  startedinstructions = true;
  finishedinstructions = false;
  // continue with instructions for arena task
  instr_id = "arena_task";
  setInstructions(instr_id);
  changeInstructions();
  goWebsite(html_taskinstr);
}

function finishExperiment_resize() {
  //instructions screen
  if (!isFullscreen() && $("#startButton").length > 0) {
    document.getElementById("startButton").disabled = true;
  }
  //task screen
  if (!isFullscreen() && startedexperiment && !finishedexperiment) {
    stopExperiment();
    saveExperiment("data/resize");
    goWebsite(html_errscreen);
  } else if (!isFullscreen() && startedinstructions && !finishedinstructions) {
    goWebsite(html_errscreen);
  } else if (!isFullscreen() && starteddissimjudge && !finisheddissimjudge) {
    arena_removeUI();
    saveExperiment("data/resize");
    goWebsite(html_errscreen);
  }
}

function finishExperiment_noresponse() {
  // stop the experiment
  edata.exp_finishtime = getTimestamp();
  stopExperiment();
  // send the data
  saveExperiment("data/noresponse");
  goWebsite(html_errnoresp);
}

function finishExperiment_data() {
  // stop the experiment
  console.log("finished experiment");
  edata.exp_finishtime = getTimestamp();
  //stopExperiment();
  // send the data
  goWebsite(html_sending);
  saveExperiment("data/data");
  // load vericode website and inject group-specific vericode
  gotoVericode();
}

function gotoVericode() {
  webfunc = function (data) {
    document.getElementById("webbodyDiv").innerHTML = data;
    document.getElementById("veriCode").innerHTML = parameters.vericode;
    document.getElementById("veriURL").text =
      "https://app.prolific.co/submissions/complete?cc=" + parameters.vericode;
    document.getElementById("veriURL").href =
      "https://app.prolific.co/submissions/complete?cc=" + parameters.vericode;
    coding.webfile = html_vercode;
  };
  $.post(html_vercode, [], webfunc);
}

function stopExperiment() {
  if (startedexperiment) {
    // set flags
    finishedexperiment = true;
    // remove
    removeFeedback();
    removeStimuli();
    removeInstructions();
    removeCountdown();
    removePaper();
    removeCue();
  }
}

function saveExperiment(path_data) {
  //set the data to be saved
  var path_tmp = "data/tmp";

  var alldata = {
    task: participant_task,
    path: path_tmp,
    id: participant_id,
    rule_taskBlue: JSON.stringify(participant_taskBlue_rule),
    rule_taskOrange: JSON.stringify(participant_taskOrange_rule),
    task_id: JSON.stringify(parameters.task_id),
    key_assign: JSON.stringify(parameters.keyStr),
    sdata: JSON.stringify(sdata),
    edata: JSON.stringify(edata),
    parameters: JSON.stringify(parameters),
    data_arenatask: JSON.stringify(data_arena),
    params_dissimexp: JSON.stringify(params_exp),
    params_dissimvis: JSON.stringify(params_vis),
    params_dissimui: JSON.stringify(params_ui),
  };

  if (finishedexperiment && finisheddissimjudge) {
    alldata.move = path_data;
  }
  //send it to the back-end
  logWrite(alldata);
}
