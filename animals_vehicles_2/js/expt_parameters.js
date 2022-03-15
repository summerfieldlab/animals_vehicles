/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Sets all the important parameters
original version: Timo Flesch, 2016
updated version: Timo Flesch, 2021
[[timoflesch19 [at] gmail [dot] com]]

************************************************************************************** */

// globals
var FLAG_DBG = 1; //toggle debugging output
// subject data
var sdata;
// experiment data
var edata;
// self-explanatory
var parameters;
// the raphael.js canvas
var board;
// trial and block indices
var coding;
// stimulus container
var stim;

function setExperiment() {
  // EDATA ----------------
  edata = {};
  // expt
  edata.expt_subject = participant_id;
  edata.expt_sex = participant_gender;
  edata.expt_age = participant_age;
  edata.expt_task = participant_task;
  edata.expt_turker = participant_turker;

  // PARAMETERS -----------
  parameters = {};

  // TIMINGS
  parameters.cue_timein = 0;
  parameters.cue_timeout = 1000;
  parameters.stimulus_timein = 1000;
  parameters.stimulus_timeout = 4000;
  parameters.response_timeout = 4000; // max response time
  parameters.warnings_timeout = 0; // response warning time (after response_timeout has beed reached)
  parameters.feedback_timein = 500; // delay after action until feedback is displayed
  parameters.feedpos_timeout = 1500; // feedback time (good)
  parameters.feedneg_timeout = 1500; // feedback time (bad)
  parameters.iti_timeout = 1000; // inter trial interval

  // TASK
  set_subjParams(); // obtains subject-specific params from URL (index.html?id=NUMS)

  parameters.vericode = "68279FDA";

  parameters.keyStr = parameters.keyassignment
    ? ["f: accept", " j: reject"]
    : ["j: accept", " f: reject"];
  // urls
  parameters.shopURL = "stores/"; // folder that contains images of shops (the contexts)
  parameters.stimURL = "stims/"; // folder that contains image files of stimuli
  parameters.keyURL = "lib/png/"; // location of image files for key mapping

  parameters.nb_size = 5; // how many levels?
  parameters.nb_speed = 5; // how many levels?
  parameters.nb_reps = 2; // how many repetitions (of exemplars) within each block?
  parameters.nb_reps_test = 1; // how many reps of each task within test ?
  parameters.nb_tasks_test = 2; // how many tasks within test block? needs to be 2 to cover both tasks!!
  parameters.nb_unique = 4; // 4 unique exemplars (per phase)
  parameters.nb_exemplars = 10; // total number of unique exemplars per stim in dataset
  parameters.nb_trials_train =
    parameters.nb_size *
    parameters.nb_speed *
    parameters.nb_unique *
    parameters.nb_reps; //200 trials per training task
  parameters.nb_trials_test =
    parameters.nb_size *
    parameters.nb_speed *
    parameters.nb_unique *
    parameters.nb_tasks_test; // 100 trials per test task
  parameters.nb_blocks = 2; // has to be at least 2 (both tasks
  parameters.nb_blocks_test = 1; // .. + test)
  parameters.nb_total_train = parameters.nb_blocks * parameters.nb_trials_train; // 400 training trials in total
  parameters.nb_total_test = parameters.nb_trials_test; // 200 training trials in total
  parameters.nb_trialsTotal =
    parameters.nb_total_train + parameters.nb_total_test;
  parameters.val_categories = [-1, -1, 0, 1, 1];
  parameters.val_rewards = [-50, -25, 0, 25, 50];

  exemplar_ids = set_exemplar_ids();
  parameters.exemplar_ids_train = exemplar_ids[0];
  parameters.exemplar_ids_test = exemplar_ids[1];

  // VISUALS
  parameters.visuals = {};
  // size
  parameters.visuals.size = {};
  parameters.visuals.size.shop = [550, 550]; // context
  parameters.visuals.size.stim = [300, 200]; // stimulus image
  parameters.visuals.size.fbt = [150, 100]; // feedback image
  parameters.visuals.size.keyIMG = [75, 75]; // size of key image

  // width
  parameters.visuals.width = {};
  parameters.visuals.width.stimframe = 4; // frame around stimuli
  parameters.visuals.width.keyframe = 4;
  parameters.visuals.width.keyIMGoffset = 10;
  // colors
  parameters.visuals.cols = {};
  parameters.visuals.cols.fbn_pos = "#080"; // positive feedback
  parameters.visuals.cols.fbn_neg = "#D00"; // negative feedback
  parameters.visuals.cols.fbn_neu = "black"; // neutral feedback
  parameters.visuals.cols.fb_bg = "grey"; // feedback background
  parameters.visuals.cols.instrtxt = "white"; // instruction texts for each block
  parameters.visuals.cols.ctx = ["#17B3C6", "#F3700F"]; // context rects

  // misc
  parameters.visuals.blurlvl = 10; // how much blur?

  // TEXT
  parameters.txt = {};
  parameters.txt.trainBreakBlocked =
    "A couple of seconds' break. \n \n In the next block, you'll do a different task! \n \n There will be a new store and different features of the stimuli will be predictive of the reward. \n \n Thus, you need to learn from scratch. \n \n Press the SPACE bar when you're ready to continue";

  parameters.txt.trainInstrBlocked =
    "This is the first block of the experiment. \n \n The store will be the same for the entire block and a picture of it will be presented on each trial before you'll see the stimulus. \n \n Via trial and error, you'll learn the rule that tells you which stimuli give you the highest reward in this store. \n \n Press the f or j key to accept/reject a stimulus. \n \n On each trial, we'll tell you which button corresponds to which response. Use the F key for responses shown on the left. \n\n Use the J key for responses shown on the right. \n\n Press the SPACE bar when you're ready to continue";

  parameters.txt.trainBreakInterleaved =
    "A couple of seconds' break. \n \n In the next block, you'll do the same experiment! \n \n Nothing has changed. We just want to give you enough time to discover the rules. \n \n Press the SPACE bar when you're ready to continue";

  parameters.txt.trainInstrInterleaved =
    "This is the first block of the experiment. \n \n Please pay attention to the cue at the beginning of each trial that tells you which store you're currently in! \n \n The cue is just an image of one of the two stores (orange or blue). \n \n The cue will change every few trials! \n \n You need to learn two rules: \n \n Which stimuli to accept in the orange store, and \n \n which stimuli to accept in the blue store. \n \n  \n \n Press the f or j key to accept/reject a stimulus. \n \n On each trial, we'll tell you which button corresponds to which response. Use the F key for responses shown on the left. \n\n Use the J key for responses shown on the right. \n\n Press the SPACE bar when you're ready to continue";

  parameters.txt.testInstructions_dom1 =
    "Now let's see how well you've learned the rules for the ANIMAL stores! \n \n In the next block, you'll have to apply the knowledge you have gained about customer preferences to two VEHICLE stores. \n \n At the beginning of each trial, you'll see an image of the store you're currently in (orange or blue). \n \n Then, you'll see a stimulus and have to decide whether to accept it or not. \n \n  WE'll ONLY GIVE YOU FEEDBACK ON SOME TRIALS. THIS IS THE TEST SESSION. \n \n Remember that customers of the vehicles stores have similar preferences to those who went to animals stores!\n \n Press the SPACE bar when you're ready to continue";
  parameters.txt.testInstructions_dom2 = "Now let's see how well you've learned the rules for the VEHICLE stores! \n \n In the next block, you'll have to apply the knowledge you have gained about customer preferences to two ANIMAL stores. \n \n At the beginning of each trial, you'll see an image of the store you're currently in (orange or blue). \n \n Then, you'll see a stimulus and have to decide whether to accept it or not. \n \n  WE'll ONLY GIVE YOU FEEDBACK ON SOME TRIALS. THIS IS THE TEST SESSION. \n \n Remember that customers of the animals stores have similar preferences to those who went to vehicles stores!\n \n Press the SPACE bar when you're ready to continue";
  // SDATA ----------------
  sdata = {};
  // expt
  sdata.expt_index = []; // trial IDX (total)
  sdata.expt_trial = []; // trial IDX (within block)
  sdata.expt_block = []; // block IDX
  sdata.expt_sizeIDX = []; // level of size
  sdata.expt_speedIDX = []; // level of speed
  sdata.expt_rewardIDX = []; // reward: neg & pos
  sdata.expt_catIDX = []; // category: accept vs reject
  sdata.expt_contextIDX = []; // task: blue vs orange
  sdata.expt_congruencyIDX = []; // congruency of trials
  sdata.expt_domainIDX = []; // domain: animals vs objects
  createSdata();

  // resp
  sdata.resp_timestamp = []; // time when button was pressed
  sdata.resp_reactiontime = []; // RT wrt stimulus ONSET
  sdata.resp_category = []; // responded category
  sdata.resp_correct = []; // trial-wise accuracy
  sdata.resp_reward = []; // trial-wise received reward
  sdata.resp_return = []; // trial-wise cummulative reward (=return)

  // BOARD ----------------
  board = {}; // will contain the canvas

  // CODING ---------------
  coding = {}; // exp logic
  // index
  coding.task = 0;
  coding.index = 0;
  coding.trial = 0;
  coding.block = 0;
  coding.return = 0;
  // other
  coding.answering = false;
  coding.timestamp = NaN;

  // STIM -------------------
  stim = {};
  stim.names = data_set_filenames();

  // INSTRUCTIONS
  setInstructions();
}

function set_exemplar_ids() {
  // create array of incrementing integers
  arr = Array.from(Array(parameters.nb_exemplars), (_, i) => i + 1);
  // shuffle
  arr = rnd_fisherYates(arr);
  // split into training and test indices
  return [
    arr.slice(0, parameters.nb_unique),
    arr.slice(parameters.nb_unique, parameters.nb_unique * 2),
  ];
}

function data_set_filenames() {
  /*
     generates array of file names
  */

  domains = ["an_", "ve_"];

  fileNames = [];
  for (var dd = 0; dd < domains.length; dd++) {
    for (var ii = 1; ii <= parameters.nb_size; ii++) {
      for (var jj = 1; jj <= parameters.nb_speed; jj++) {
        for (var kk = 1; kk <= parameters.nb_unique; kk++) {
          fileNames.push(
            [
              domains[dd] +
                "size" +
                ii.toString() +
                "_speed" +
                jj.toString() +
                "_" +
                kk.toString() +
                ".jpg",
            ].join()
          );
        }
      }
    }
  }
  //  fileNames = rnd_fisherYates(fileNames);

  if (FLAG_DBG) {
    console.log(fileNames.join(",\n"));
  }

  return fileNames;
}

function set_subjParams() {
  /*
    grabs params from url argument
    input structure:
    ?id=abcd
    a = 1/2   = domains. 1 =animals->vehicles, 2 = vehicles->animals
    b = 1/2/3 = bAB,bBA,interl
    c  = 1:8   = cardinal: nn,ff,fn,nf, diagonal: nn,ff,fn,nf (f=flipped, n=normal)
    d = 1/2/3   = blockiness: 2,20,200
  */
  input = getQueryParams();

  if (typeof input.id == "undefined") {
    parameters.task_id = "blocked-A-B".split("-"); // blocked blue orange
    parameters.val_rewAssignment = 1; // no flipped assignments, cardinal boundary
    parameters.keyassignment = 0; // l-no r-yes
    parameters.blockiness = 200; // how many trials of one task per block?
    parameters.domains = ["animals", "vehicles"]; // domains for training [0] and test [1] phase
    parameters.contexts = [
      "an_store_1.png",
      "an_store_2.png",
      "ve_store_1.png",
      "ve_store_2.png",
    ];
    parameters.taskprefix = ["an_", "an_", "ve_", "ve_"];
    parameters.domaincode = 1;
  } else {
    input.id = input.id.split("").map(Number);
    // 0. domain
    switch (input.id[0]) {
      case 1:
        parameters.domains = ["animals", "vehicles"];
        parameters.domaincode = 1;
        parameters.taskprefix = ["an_", "an_", "ve_", "ve_"];
        break;
      case 2:
        parameters.domains = ["vehicles", "animals"];
        parameters.domaincode = 2;
        parameters.taskprefix = ["ve_", "ve_", "an_", "an_"];
        break;
      default:
        parameters.domains = ["animals", "vehicles"];
        parameters.domaincode = 1;
        parameters.taskprefix = ["an_", "an_", "ve_", "ve_"];
    }

    // 1. curriculum
    switch (input.id[1]) {
      case 1:
        parameters.task_id = "blocked-A-B".split("-");
        break;
      case 2:
        parameters.task_id = "blocked-B-A".split("-");
        break;
      case 3:
        parameters.task_id = "interleaved-A-B".split("-");
        break;
      default:
        parameters.task_id = "blocked-A-B".split("-");
        break;
    }

    parameters.contexts = [
      parameters.taskprefix[0] + "store_1.png",
      parameters.taskprefix[1] + "store_2.png",
    ];
    // 2. reward & boundary
    parameters.val_rewAssignment = input.id[2]; // second and third items

    // 3. keys
    parameters.keyassignment = randi(2, 1); // 0: l-no r-yes, 1: l-yes r-no

    // 4. blockiness (becomes irrelevant for interleaved design)
    switch (input.id[3]) {
      case 1:
        parameters.blockiness = 2;
        break;
      case 2:
        parameters.blockiness = 20;
        break;
      case 3:
        parameters.blockiness = 200;
        break;
      default:
        parameters.blockiness = 200;
        break;
    }
    // however, if interleaved, set back to 200
    if (input.id[0] == 3) {
      parameters.blockiness = 200;
    }
  }
  if (FLAG_DBG) {
    console.log(parameters.task_id);
    console.log(parameters.blockiness);
    console.log(parameters.val_rewAssignment);
  }
}
