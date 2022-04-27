
function startExperiment() {
    

    // set booleans for fullscreen tracking
    finishedinstructions =  true;
    startedinstructions  = false;
    starteddissimjudge   =  true;
    finisheddissimjudge  = false;

    // set parameters
    setExperiment(); //expt_parameters.js

    // log start time
    edata.exp_starttime = getTimestamp();

    // run the experiment
    run_likert_experiment()


    

}

function loadLikertDIV(_callback) {
  // some async work:
  goWebsite(html_likert);
  _callback();  
}

function runLikert() {
  loadLikertDIV(function() { run_likert_experiment()});
}

function finishExperiment() {
  // save data
  saveExperiment();
  // booleans for fullscreen tracking
  starteddissimjudge   = false;
  finisheddissimjudge  =  true;
  startedinstructions  =  false;
  finishedinstructions = true;

  // get timestamp, send data to data/data
  // and generate vericode
  finishExperiment_data();
}



function finishExperiment_resize() {
  //instructions screen
  if(!isFullscreen() && $('#startButton').length>0){
    document.getElementById('startButton').disabled = true;
  }
  //task screen
 if(!isFullscreen() && startedinstructions && !finishedinstructions) {
    saveExperiment("data/resize");
    goWebsite(html_errscreen);

  }
  else if(!isFullscreen() && starteddissimjudge && !finisheddissimjudge) {
    experiment_removeUI();
    finisheddissimjudge = true;
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
  console.log('finished experiment');
  finishedexperiment = true;
  edata.exp_finishtime = getTimestamp();
  //stopExperiment();
  // send the data
  goWebsite(html_sending);
  saveExperiment("data/data");
  // load vericode website and inject group-specific vericode
  gotoVericode();
  
}


function gotoVericode() {
  webfunc = function(data) {
    document.getElementById("webbodyDiv").innerHTML = data;
    document.getElementById('veriCode').innerHTML = params_exp.vericode;
    document.getElementById('veriURL').text = "https://app.prolific.co/submissions/complete?cc=" + params_exp.vericode;
    document.getElementById('veriURL').href = "https://app.prolific.co/submissions/complete?cc=" + params_exp.vericode;    
    coding.webfile = html_vercode;
  };
  $.post(html_vercode,[],webfunc);
}


function stopExperiment() {
  if(startedexperiment){
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


function saveExperiment(path_data){
  //set the data to be saved
  var path_tmp  = "data/tmp";

  var alldata = {
      task:       participant_task,
      path:       path_tmp,
      id:         participant_id,                  
      edata:      JSON.stringify(edata),
      params_exp:     JSON.stringify(params_exp),
      params_ui:  JSON.stringify(params_ui),
      stim_domain: params_exp.stimtype,
      stim_feature: params_exp.feature,
      images:       JSON.stringify(results.img),
      responses:    JSON.stringify(results.responses),
      image_ids:    JSON.stringify(results.stim_id)
      
  };

  if(finisheddissimjudge) {
    alldata.move = path_data;
  }
  //send it to the back-end
  logWrite(alldata);
}
