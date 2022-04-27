/* ****************************************************************************
 parameters for task and user interface

 Timo Flesch, 2020,
 Human Information Processing Lab,
 Experimental Psychology
 University of Oxford

 **************************************************************************** */

// set globals

var FLAG_DBG = 1; // toggle debugging output

// subject data
var sdata;
// experiment data
var edata;
// the canvas
var board;
// trial indices
var coding;
// deprecated
var instr_id;

// parameters for user interface
var params_ui = {};
// parameters for task
var params_exp = {};
// raphael.js canvas
var board = {};
// counters etc
var numbers = {};
// stimulus container
var stim = {};


function setExperiment() {


  // EDATA ----------------
  edata = {};
  // expt
  edata.expt_subject = participant_id;
  edata.expt_sex     = participant_gender;
  edata.expt_age     = participant_age;
  edata.expt_task    = participant_task;
  edata.expt_turker  = participant_turker;

   
  // CANVAS
  board.width   =                    window.innerWidth;
  board.height  =                   window.innerHeight;
  board.centre  =   [Math.floor(0.5*window.innerWidth), 
      Math.floor(0.5*window.innerHeight)];
  board.radius  =                    0.40*board.height;
  board.rect 	  =       [0,0,board.width,board.height];

  // EXPERIMENT
  params_exp.n_size = 5;     // how many different a priori size levels?
  params_exp.n_speed = 5;    // how many different a priori speed levels?
  params_exp.n_unique = 10;  // how many unique stims per category   
  params_exp.n_trials = 250; // how many trials per subject?
  params_exp.stimtype = "animal";
  params_exp.feature  = 'large';
  params_exp.stim_dir = 'stims/' + params_exp.stimtype  + 's/';
  params_exp.instr_dir = 'instructions/';

  // USER INTERFACE
  params_ui.n_items = 5;
  

  // stimulus 
  params_ui.stim = {};
  params_ui.stim.fill           =      "white";
  params_ui.stim.stroke         =      "black";
  params_ui.stim.edgecurvature  =            0;
  params_ui.stim.strokewidth    =            5;

  // navigation button
  params_ui.button              =           {};
  params_ui.button.text         = "Next Trial";
  params_ui.button.fill         =      'white';
  params_ui.button.stroke       =    '#3b4449';
  params_ui.button.width        =            2;
  params_ui.button.font         =  "Helvetica";
  params_ui.button.fontsize     =         "18";


  params_ui.button.glow         =           {};
  params_ui.button.glow.opacity =       '0.55';
  params_ui.button.glow.colour  =       'blue';
  params_ui.button.glow.width   =          '2';
  
  // gradient 
  params_ui.grad  = {};
  params_ui.grad.fill           = "0-#999696-#ffffff"; // (was 0-#f52905-#299e33)
  params_ui.grad.stroke         =             "black";
  params_ui.grad.strokewidth    =                   1;
  
  // likert 
  params_ui.likert           = {};
  params_ui.likert.locations = [-500*0.6,-250*0.6,0,250*0.6,500*0.6];
  
  params_ui.likert.button        =         {};
  params_ui.likert.button.fill   =    "white";
  params_ui.likert.button.stroke =  '#3b4449';
  params_ui.likert.button.width  =          2;
  params_ui.likert.button.glow         =      {};
  params_ui.likert.button.glow.opacity =       5;
  params_ui.likert.button.glow.colour  = "white";
  params_ui.likert.button.glow.width   =     '2';

  params_ui.likert.selector         =      {};
  params_ui.likert.selector.fill    = "black";
  params_ui.likert.selector.stroke  =       2;
  params_ui.likert.selector.width   =       2;
  params_ui.likert.selector.opacity =    "0%";

  params_ui.likert.labels           = {};
  params_ui.likert.labels.font      = "Helvetica";
  params_ui.likert.labels.fontsize  = "20";
  params_ui.likert.labels.weight    = "bold";
  if (params_exp.feature=="dangerous") {
    params_ui.likert.labels.content   = ["very low", "low", "medium", "high", "very high"];
  }
  else if (params_exp.feature="large") {
    params_ui.likert.labels.content   = ["very small", "small", "medium", "large", "very large"];
  }
  

  params_ui.likert.question         = {};
  params_ui.likert.question.font    = "Helvetica";
  params_ui.likert.question.fontsize = "28";
  params_ui.likert.question.weight   = "normal";
  params_ui.likert.question.content  = "How " + params_exp.feature +  " is this " + params_exp.stimtype + "?";

 //overwrite params
 set_subjParams();

 // STIMULI
 stim.prefix = (params_exp.stimtype=='animal') ? 'an_' : 've_';
 stim.suffix = '.jpg';
 stim.n_total = params_exp.n_trials;
 // randomly sample NTRIALS idces from vector of item ids 
//  stim.ids = rnd_fisherYates(Array.from(Array(stim.n_total).keys(), x => x + 1)).slice(0,params_exp.n_trials)
 stim.names = data_set_filenames();


 // COUNTER
 numbers.trial_count = 0;
}



function data_set_filenames() {
/*
   generates array of file names
*/

   fileNames = [];
   for (var ii =1; ii<=params_exp.n_size;ii++) {
     for (var jj=1; jj<= params_exp.n_speed; jj++){
       for (var kk=1; kk<= params_exp.n_unique; kk++) {
         fileNames.push([stim.prefix + 'size' + ii.toString() + '_speed' + jj.toString() + '_' + kk.toString() + stim.suffix].join());
       }
     }	 
   }
   fileNames = rnd_fisherYates(fileNames);
   if (FLAG_DBG) {
	   console.log(fileNames.join(',\n'))
   }

   return fileNames;
}



function set_subjParams() {
 /*
   grabs params from url

 */
 input = getQueryParams();


 if (typeof(input.id)=="undefined" ) {
   params_exp.stimtype = 'animal';
   params_exp.feature = 'fast';
   params_exp.vericode = '81B7C97D';
  
 }

 else {
      input.id = input.id.split('').map(Number);
      // 1. curriculum
      switch (input.id[0]) {
      case 1:
      params_exp.stimtype = 'animal';
      params_exp.feature = 'large';
      params_exp.vericode = '81B7C97D';
      break;
      case 2:
      params_exp.stimtype = 'animal';
      params_exp.feature = 'fast';
      params_exp.vericode = '81B7C97D';
      break;
      case 3:
      params_exp.stimtype = 'vehicle';
      params_exp.feature = 'large';
      params_exp.vericode = '81B7C97D';
      break; 
      case 4:
      params_exp.stimtype = 'vehicle';
      params_exp.feature = 'fast';
      params_exp.vericode = '81B7C97D';      
      break;
      default:
      params_exp.stimtype = 'animal';
      params_exp.feature = 'fast';
      params_exp.vericode = '81B7C97D';
      break;
      }

 }

  if (params_exp.feature=="large") {
    params_ui.likert.labels.content   = ["very small", "small", "medium", "large", "very large"];
  }
  else if (params_exp.feature=='fast') {
    params_ui.likert.labels.content = ['very slow','slow','medium','fast','very fast'];
  }

  params_ui.likert.question.content  = "How " + params_exp.feature +  " is this " + params_exp.stimtype + "?";

  params_exp.stim_dir = './stims/' + params_exp.stimtype  + 's/';


  if (FLAG_DBG) {
    console.log(params_exp.stimtype);
    console.log(params_exp.feature);
  }


}
