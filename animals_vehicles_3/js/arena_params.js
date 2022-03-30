/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Parameters for  Arena Task
(c) Timo Flesch, 2016/17 


************************************************************************************** */

var FLAG_DBG_ARENA = 1;

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
  params_vis.stimSize = 0.3 * board.radius;
  params_vis.circle = {};
  params_vis.circle.colour = "grey";
  params_vis.circle.opacity = "1";

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
  params_exp.domains = ["an_", "ve_"];
  params_exp.exemplars = Array.from(Array(10), (_, i) => i + 1);
  params_exp.numTrials = 4;
  params_exp.numStimuli = 25;
  params_exp.numTotal = params_exp.numTrials * params_exp.numStimuli;

  // STIMULI
  arena_stims.obj = []; // container for stim objects
  arena_stims.coordsOrig = []; // saves coordinates of stim objects
  arena_stims.coordsFinal = []; // submitted stimulus coordinates

  arena_stims.stimVect = set_exp_stimVect();
  arena_stims.stimNames = set_exp_fileNames();

  // TRIAL COUNTERS
  numbers.trialCount = 1;
  numbers.stimCount = 0;
}
