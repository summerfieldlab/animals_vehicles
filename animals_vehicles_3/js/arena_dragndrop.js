/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Drag and Drop Functions
(c) Timo Flesch, 2016/17 


************************************************************************************** */

start = function start() {
  /*
	returns initial coordinates of object
*/
  // start state
  this.ox = this.attr("x");
  this.oy = this.attr("y");
};

move = function (dx, dy) {
  /*
	updates coordinates according to change in x  and y direction
	changes opacity to visualize that object is being dragged
*/

  thisBox = this.getBBox();
  var ddx = this.ox + dx;
  var ddy = this.oy + dy;
  ddx_orig = ddx - board.centre[0] + params_vis.stim.size[0] / 2;
  ddy_orig = ddy - board.centre[1] + params_vis.stim.size[1] / 2;
  //compute polar coordinates
  r_current = Math.sqrt(ddx_orig * ddx_orig + ddy_orig * ddy_orig);
  phi = Math.atan2(ddx_orig, ddy_orig);

  // ensure that stimuli are not moved outside of canvas
  if (r_current >= board.radius - params_vis.stim.radius / 2) {
    // new radius
    r_new = board.radius - params_vis.stim.radius / 2;
    // new cartesian coordinates
    ddx = r_new * Math.sin(phi) + board.centre[0] - params_vis.stim.size[0] / 2;
    ddy = r_new * Math.cos(phi) + board.centre[1] - params_vis.stim.size[1] / 2;
  }

  // update position
  this.attr({ x: ddx, y: ddy });

  this.attr({ opacity: 0.5 });

  this.toFront();
  
};

up = function () {
  /*
	restores opacity as mouse button is released
*/
  // final state (restore)
  this.attr({ opacity: 1.0 });
  $("#coords").html([]);
};
