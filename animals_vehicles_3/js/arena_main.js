/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Implements 2D dissimilarity ratings 
(c) Timo Flesch, 2016/17 


************************************************************************************** */

function runDissimJudgeExp() {
  // init params
  arena_setParams();

  // draw user interface
  arena_setUI();
  arena_update();

  // add nice clock
  // drawClock([board.centre[0], board.centre[1]+window.innerHeight*0.49]);

  // init raphael-set and fill with stimuli, allow participant to start.
  stims_fillSet();
}
