/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

User Interface
(c) Timo Flesch, 2016/17 


************************************************************************************** */

function arena_setUI() {
  // CANVAS
  // set up circular canvas
  board.paper.object = drawPaper(board.rect);
  draw_aperture();

  // draw reminder of task-specific shops
  //remove_shoprect();
  //draw_shopreminder();
  draw_shoptext();

  // BUTTON
  // create button to go to next trial
  board.buttonBox = board.paper.object
    .rect(
      board.centre[0] - 60,
      board.centre[1] + window.innerHeight * 0.42,
      120,
      25,
      5
    )
    .attr({
      fill: params_vis.trialcolours[numbers.trialCount - 1],
      stroke: params_vis.trialcolours[numbers.trialCount - 1],
      "stroke-width": params_ui.button.width,
    });
  board.buttonText = board.paper.object
    .text(
      board.buttonBox.attrs.x + board.buttonBox.attrs.width / 2,
      board.buttonBox.attrs.y + board.buttonBox.attrs.height / 2,
      "Next Trial"
    )
    .attr({
      "font-family": params_ui.button.font,
      "font-size": params_ui.button.fontsize,
      fill: "white",
    });

  board.buttonText.node.setAttribute("class", "donthighlight"); // prevents user from accidentally highlighting/selecting UI text
  board.buttonObject = board.paper.object.set().attr({
    cursor: "pointer",
  });
  board.buttonObject.push(board.buttonBox);
  board.buttonObject.push(board.buttonText);

  board.buttonObject
    .mouseover(function (event) {
      this.oGlow = board.buttonBox.glow({
        opacity: params_ui.button.glow.opacity,
        color: params_vis.trialcolours[numbers.trialCount - 1],
        width: params_ui.button.glow.width,
      });
    })
    .mouseout(function (event) {
      this.oGlow.remove();
    })
    .click(function (e) {
      if (numbers.trialCount < params_exp.numTrials) {
        gotoNextTrial();
      } else {
        gotoNextTask();
      }
    });
}

function arena_removeUI() {
  board.paper.object.remove();
}

function arena_update() {
  /*
  updates ui with trial-specific information
  */
  // update shop reminder
  //remove_shopreminder();
  remove_shoptext();
  //draw_shopreminder();
  draw_shoptext();

  // give aperture colour of current task
  board.circle.attr({
    stroke: params_vis.trialcolours[numbers.trialCount - 1],
    "stroke-width": 10,
  });

  // // ditto for task reminder
  // board.shoprect.attr({
  //   stroke: params_vis.trialcolours[numbers.trialCount - 1],
  //   "stroke-width": 5,
  // });

  // give next trial button task-specific colours
  board.buttonBox.attr({
    stroke: params_vis.trialcolours[numbers.trialCount - 1],
    fill: params_vis.trialcolours[numbers.trialCount - 1],
  });
}
