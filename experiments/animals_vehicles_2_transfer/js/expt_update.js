/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/*
Timo Flesch [timoflesch19 [at] gmail [dot] com]
*/

function updateCue() {
  board.cue.object.remove();

  shopName =
    sdata.expt_domainIDX[coding.index] +
    "store_" +
    sdata.expt_contextIDX[coding.index] +
    ".png";
  shopColor = parameters.visuals.cols.ctx[sdata.expt_contextIDX[coding.index]-1];
  drawShop(shopName, 0);
  drawShop(shopName, 1);
  // update context rect
  board.blurcue.context.attr({
    stroke: shopColor,
    "stroke-width": 20,
  });
  board.cue.context.attr({
    stroke: shopColor,
    "stroke-width": 20,
  });
}

function updateKeys() {
  board.instructions.keys = drawKeys(sdata.expt_keyassignment[coding.index]);
}

function updateStimuli() {
  stimulusName = sdata.expt_domainIDX[coding.index].concat(
    "size"
      .concat(sdata.expt_sizeIDX[coding.index].toString())
      .concat("_speed")
      .concat(sdata.expt_speedIDX[coding.index].toString())
      .concat(
        "_" + sdata.expt_exemplarIDX[coding.index].toString().concat(".jpg")
      )
  );
  board.stimuli.stimulus = drawStimulus(stimulusName);
}

// display correct reward values
function updateFeedback() {
  board.rightfeedback.rect = drawChoiceRect("right");
  board.leftfeedback.rect = drawChoiceRect("left");

  if (sdata.expt_keyassignment[coding.index]) {
    if (sdata.expt_rewardIDX[coding.index] > 0) {
      board.leftfeedback.text = "+".concat(
        sdata.expt_rewardIDX[coding.index].toString()
      );
      board.leftfeedback.colour = parameters.visuals.cols.fbn_pos;
    } else if (sdata.expt_rewardIDX[coding.index] < 0) {
      board.leftfeedback.text = sdata.expt_rewardIDX[coding.index].toString();
      board.leftfeedback.colour = parameters.visuals.cols.fbn_neg;
    } else if (sdata.expt_rewardIDX[coding.index] == 0) {
      board.leftfeedback.text = "+".concat(
        sdata.expt_rewardIDX[coding.index].toString()
      );
      board.leftfeedback.colour = parameters.visuals.cols.fbn_neu;
    }
    board.leftfeedback.object = drawText(
      board.paper.object,
      [
        board.paper.centre[0] -
          parameters.visuals.size.stim[0] / 2 -
          parameters.visuals.size.keyIMG[0] +
          30,
        board.paper.centre[1],
      ],
      board.leftfeedback.text
    );
    board.leftfeedback.object.attr({ "font-size": board.font_bigsize });
    board.leftfeedback.object.attr({
      fill: board.leftfeedback.colour,
      stroke: board.leftfeedback.colour,
      "stroke-width": "1px",
      "paint-order": "stroke",
    });

    board.rightfeedback.text = "+0";
    board.rightfeedback.colour = parameters.visuals.cols.fbn_neu;
    board.rightfeedback.object = drawText(
      board.paper.object,
      [
        board.paper.centre[0] + parameters.visuals.size.stim[0] / 2 + 50,
        board.paper.centre[1],
      ],
      board.rightfeedback.text
    );
    board.rightfeedback.object.attr({ "font-size": board.font_bigsize });
    board.rightfeedback.object.attr({
      fill: board.rightfeedback.colour,
      stroke: board.rightfeedback.colour,
      "stroke-width": "1px",
      "paint-order": "stroke",
    });
  } else {
    if (sdata.expt_rewardIDX[coding.index] > 0) {
      board.rightfeedback.text = "+".concat(
        sdata.expt_rewardIDX[coding.index].toString()
      );
      board.rightfeedback.colour = parameters.visuals.cols.fbn_pos;
    } else if (sdata.expt_rewardIDX[coding.index] < 0) {
      board.rightfeedback.text = sdata.expt_rewardIDX[coding.index].toString();
      board.rightfeedback.colour = parameters.visuals.cols.fbn_neg;
    } else if (sdata.expt_rewardIDX[coding.index] == 0) {
      board.rightfeedback.text = "+".concat(
        sdata.expt_rewardIDX[coding.index].toString()
      );
      board.rightfeedback.colour = parameters.visuals.cols.fbn_neu;
    }

    board.rightfeedback.object = drawText(
      board.paper.object,
      [
        board.paper.centre[0] + parameters.visuals.size.stim[0] / 2 + 50,
        board.paper.centre[1],
      ],
      board.rightfeedback.text
    );
    board.rightfeedback.object.attr({ "font-size": board.font_bigsize });
    board.rightfeedback.object.attr({
      fill: board.rightfeedback.colour,
      stroke: board.rightfeedback.colour,
      "stroke-width": "1px",
      "paint-order": "stroke",
    });

    board.leftfeedback.text = "+0";
    board.leftfeedback.colour = parameters.visuals.cols.fbn_neu;
    board.leftfeedback.object = drawText(
      board.paper.object,
      [
        board.paper.centre[0] -
          parameters.visuals.size.stim[0] / 2 -
          parameters.visuals.size.keyIMG[0] +
          30,
        board.paper.centre[1],
      ],
      board.leftfeedback.text
    );
    board.leftfeedback.object.attr({ "font-size": board.font_bigsize });
    board.leftfeedback.object.attr({
      fill: board.leftfeedback.colour,
      stroke: board.leftfeedback.colour,
      "stroke-width": "1px",
      "paint-order": "stroke",
    });
  }
}
