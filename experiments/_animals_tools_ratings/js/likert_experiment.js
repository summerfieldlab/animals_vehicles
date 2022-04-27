
var results = {};
results.responses = [];
results.img = [];
results.stim_id = [];
results.stim_name = [];

function run_likert_experiment() {
 
  //set_parameters();
  set_ui();

}

function experiment_log_responses() {
  response = ui_get_responses();
  results.responses[numbers.trial_count] = response;
  results.img[numbers.trial_count] = stim.names[numbers.trial_count];
  results.stim_id[numbers.trial_count] = stim.ids[numbers.trial_count];
  if (FLAG_DBG)  
  console.log("------------ Trial " + (numbers.trial_count + 1)  + "/"+ params_exp.n_trials + " ------------\n");
  console.log("Domain: " + params_exp.stimtype);
  console.log("Feature: " + params_exp.feature);
  console.log("Rating: " + results.responses[numbers.trial_count]);
}


function experiment_next_trial() {
  // store results
  experiment_log_responses();
  // reset interface
  ui_reset_buttons();

  // increment by one and update images
  numbers.trial_count++;
  if (numbers.trial_count < params_exp.n_trials) {
    // update image
    board.stimulus.attr({src: params_exp.stim_dir + stim.names[numbers.trial_count] });
  }
  else {
    experiment_removeUI();
    starteddissimjudge = false;
    finisheddissimjudge = true;
    finishedexperiment = true;
    finishExperiment_data();
   
  }
}

function experiment_thankyou() {

board.paper.remove()
// stopClock();
document.getElementById("wrap").innerHTML = '<div style="text-align:center;"">Thanks for taking part!</div>';


}
