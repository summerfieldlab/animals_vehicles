/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Draw and Remove Stimuli
(c) Timo Flesch, 2016/17 


************************************************************************************** */

// DRAW STIMULI ON CANVAS
function stims_fillSet() {
  /*
	1. converts images into raphael objects, 
	2. places them along the circle,
	3. adds them to raphael set
	4. makes set draggable
*/

  // rather stupid solution...time for a break, deffo. lol
  board.set = board.paper.object.set();
  phiSet = rnd_randomSampling(
    math_linspace(0, Math.floor(360 / params_exp.numStimuli), 360),
    params_exp.numStimuli
  );

  for (var i = 0; i < params_exp.numStimuli; i++) {
    stimIDX = i + params_exp.numStimuli * (numbers.trialCount - 1);

    // set coordinates and generate object
    coords = [
      Math.floor(
        (board.radius - params_vis.stim.radius / 2) * math_cos(phiSet[i])
      ),
      Math.floor(
        (board.radius - params_vis.stim.radius / 2) * math_sin(phiSet[i])
      ),
    ];

    image = board.paper.object.image(
      params_exp.stimDir + arena_stims.stimNames[stimIDX],
      board.centre[0] + coords[0] - params_vis.stim.size[0] / 2,
      board.centre[1] + coords[1] - params_vis.stim.size[1] / 2,
      params_vis.stim.size[0],
      params_vis.stim.size[1]
    );

    // add object to set
    board.set.push(image);
    arena_stims.coordsOrig[numbers.stimCount] = [
      board.set[i].attr("x"),
      board.set[i].attr("y"),
    ];
    numbers.stimCount++;
  }
  // make all objects within the set draggable
  board.set.drag(move, start, up);
}

function stims_emptySet() {
  /*
	removes all stimuli from set
*/
  board.set.remove();
}

function draw_aperture() {
  board.circle = board.paper.object
    .circle(board.centre[0], board.centre[1], board.radius)
    .attr({
      fill: params_vis.circle.colour,
      opacity: params_vis.circle.opacity,
    });
}

function draw_shoprect() {
  board.shoprect = board.paper.object
    .rect(
      board.centre[0] - (board.width / 2) * 0.98,
      board.centre[1] - (board.height / 2) * 0.5,
      board.width * 0.18,
      board.height * 0.5,
      5
    )
    .attr({ stroke: "black", "stroke-width": 2, fill: "white" });
}

function draw_shopreminder() {
  // animals shop
  shop_name =
    params_exp.shopDir +
    "an_store_" +
    arena_stims.trial_id[numbers.trialCount - 1] +
    ".png";
  board.animals_shop = board.paper.object.image(
    shop_name,
    board.centre[0] - (board.width / 2) * 0.95,
    board.centre[1] - (board.height / 2) * 0.45,
    board.width * 0.15,
    board.width * 0.15
  );
  // vehicles shop
  shop_name =
    params_exp.shopDir +
    "ve_store_" +
    arena_stims.trial_id[numbers.trialCount - 1] +
    ".png";
  board.vehicles_shop = board.paper.object.image(
    shop_name,
    board.centre[0] - (board.width / 2) * 0.95,
    board.centre[1] + (board.height / 2) * 0.03,
    board.width * 0.15,
    board.width * 0.15
  );
}

function draw_shoptext() {
  board.shoptext = [];
  x = board.width * 0.3;
  y = board.height * 0.05;
  board.shoptext[0] = board.paper.object
    .text(
      x,
      y,
      "Please arrange the images according to the rule you used for the "
    )
    .attr({ "text-anchor": "start", "font-size": 22, fill: "black" });
  x = x + board.shoptext[0].getBBox().width + 5;
  board.shoptext[1] = board.paper.object
    .text(x, y, params_exp.trialids.col[numbers.trialCount - 1])
    .attr({
      "text-anchor": "start",
      "font-size": 22,
      fill: params_vis.trialcolours[numbers.trialCount - 1],
    });
  x = x + board.shoptext[1].getBBox().width + 5;
  board.shoptext[2] = board.paper.object
    .text(x, y, "shops")
    .attr({ "text-anchor": "start", "font-size": 22, fill: "black" });

  // move so text really is in centre
  set = board.paper.object.set();
  for (let i = 0; i < board.shoptext.length; i++) {
    set.push(board.shoptext[i]);
  }
  text_width = set.getBBox().width;
  new_x = board.centre[0] - text_width / 2;
  for (let i = 0; i < board.shoptext.length; i++) {
    board.shoptext[i].attr({ x: new_x });
    new_x = new_x + board.shoptext[i].getBBox().width + 5;
  }

  // prevent user from highlighting/selecting UI text:
  for (let i = 0; i < board.shoptext.length; i++) {
    board.shoptext[i].node.setAttribute("class", "donthighlight");
  }
}

function remove_shopreminder() {
  board.animals_shop.remove();
  board.vehicles_shop.remove();
}

function remove_shoptext() {
  for (let i = 0; i < board.shoptext.length; i++) {
    board.shoptext[i].remove();
  }
}
