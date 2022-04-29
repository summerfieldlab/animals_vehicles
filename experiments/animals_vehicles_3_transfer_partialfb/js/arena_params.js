/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Parameters for  Arena Task
(c) Timo Flesch, 2016/17 


************************************************************************************** */

var FLAG_DBG_ARENA = 0;

var params_vis = {};
var params_exp = {};
var params_ui = {};
var arena_stims = {};
var numbers = {};
var board = {};
var data_arena = {};

function arena_setParams() {
  // CANVAS
  board.width = window.innerWidth;
  board.height = window.innerHeight;
  board.centre = [
    Math.floor(0.5 * window.innerWidth),
    Math.floor(0.5 * window.innerHeight),
  ];
  board.radius = 0.4 * board.height;
  board.rect = [0, 0, board.width, board.height];
  board.paper = {};

  // VISUALS
  params_vis.stim = {};
  params_vis.stim.size = [0.25 * board.radius, (2 / 3) * 0.25 * board.radius]; // width, height
  params_vis.stim.radius = 0.3 * board.radius;
  params_vis.stim.border_col = "black";
  params_vis.stim.border_width = "2";
  params_vis.circle = {};
  params_vis.circle.colour = "grey";
  params_vis.circle.opacity = "1";
  params_vis.trialcolours = ["#17B3C6", "#17B3C6", "#F3700F", "#F3700F"];

  // USER INTERFACE
  params_ui.button = {};
  params_ui.button.fill = "lightgreen";
  params_ui.button.stroke = "#3b4449";
  params_ui.button.width = 2;
  params_ui.button.font = "Helvetica";
  params_ui.button.fontsize = "12";

  params_ui.button.glow = {};
  params_ui.button.glow.opacity = "0.85";
  params_ui.button.glow.colour = "green";
  params_ui.button.glow.width = "2";

  // EXPERIMENT
  params_exp.stimDir = "./stims/";
  params_exp.shopDir = "./stores/";
  params_exp.domains = ["an_", "ve_"];
  params_exp.exemplars = Array.from(Array(10), (_, i) => i + 1);
  params_exp.numTrials = 4;
  params_exp.numStimuli = 25;
  params_exp.numTotal = params_exp.numTrials * params_exp.numStimuli;
  params_exp.trialids = {};
  params_exp.trialids.col = ["blue", "blue", "orange", "orange"];

  // STIMULI
  arena_stims.obj = []; // container for stim objects
  arena_stims.coordsOrig = []; // saves coordinates of stim objects
  arena_stims.coordsFinal = []; // submitted stimulus coordinates
  arena_stims.trial_id = [1, 1, 2, 2]; // task id (1==blue or 2==orange)
  arena_stims.stimVect = set_exp_stimVect();
  arena_stims.stimNames = set_exp_fileNames();

  // TRIAL COUNTERS
  numbers.trialCount = 1;
  numbers.stimCount = 0;
}
