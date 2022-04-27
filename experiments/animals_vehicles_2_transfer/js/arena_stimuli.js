/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function set_exp_stimVect() {
  /* 
 	creates object that sets stimulus identities for each trial 
 	On each trial, all 25 stimuli (5bx5l) will be displayed at random locations. Exemplars will be sampled at random
 	from all available stimulus sets. This ensures almost that unique sets of stimuli are displayed on each trial and for each participant
 	and allows us to rule out low-level exemplar-specific effects as these should average out within and across participants.
 */
  stimVect = {};
  stimVect.trialID = []; // which trial does a stimulus belong to?
  stimVect.domain = []; // which domain (animals/objects) 
  stimVect.dom_idx = []; // same as above, but numerical 
  stimVect.size = []; // value of size dimension
  stimVect.speed = []; // value of speed dimension
  stimVect.exemplar = []; // which exemplar
  this_domain_idx = 0;
  for (var i_trial = 1; i_trial <= params_exp.numTrials; i_trial++) {
    for (var i_size = 1; i_size <= 5; i_size++) {
      for (var i_speed = 1; i_speed <= 5; i_speed++) {
        stimVect.domain.push(params_exp.domains[this_domain_idx]);
        this_domain_idx = this_domain_idx == 1 ? 0 : 1; // flip index between 0 and 1
        stimVect.size.push(i_size);
        stimVect.speed.push(i_speed);
        stimVect.dom_idx.push(this_domain_idx);
        stimVect.exemplar.push(
          params_exp.exemplars[rnd_randInt(0, params_exp.exemplars.length)]
        );
        stimVect.trialID.push(i_trial);
      }
    }
  }
  //stimVect.exemplar = rnd_fisherYates(stimVect.exemplar);
  return stimVect;
}

function set_exp_fileNames() {
  /*
	generates array of file names
*/
  stimuli = arena_stims.stimVect;
  fileNames = [];
  for (var ii = 0; ii < stimuli.trialID.length; ii++) {
    fileNames.push(
      [
        stimuli.domain[ii] +
          "size" +
          stimuli.size[ii] +
          "_speed" +
          stimuli.speed[ii] +
          "_" +
          stimuli.exemplar[ii].toString() +
          ".jpg",
      ].join()
    );
  }

  if (FLAG_DBG_ARENA) {
    console.log(fileNames.join(",\n"));
  }

  return fileNames;
}
