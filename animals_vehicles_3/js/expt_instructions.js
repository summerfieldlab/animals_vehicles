/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* **************************************************************************************

Shows instructions via html injection
original version: Timo Flesch, 2016
updated version: Timo Flesch, 2021
[[timoflesch19 [at] gmail [dot] com]]


************************************************************************************** */

var startedinstructions = false;
var finishedinstructions = false;
var pageIDX = 0;
var inStruct = [];
inStruct.cap = []; // caption/headline
inStruct.txt = []; // content
inStruct.img = []; // illustration

// setInstructions();

function setInstructions(task_id) {
  /*
	  here I define my instructions
  */
  // goWebsite(html_taskinstr)
  // domaincode==1: first animals, then vehicles. domaincode==2: first vehicles, then animals

  if (task_id == "main_task") {
    switch (parameters.domaincode) {
      case 1:
        inStruct.txt[0] =
          " Hi! <br> Thanks for taking part in this experiment! <br> Please use the buttons below to navigate through the instructions.";
        inStruct.img[0] = "";

        // blue shop
        inStruct.txt[1] =
          "Imagine that you've just started a new job as store manager. <br> You are responsible for two animal stores.<br>The first one is the <b>blue animal store</b>. <br>";
        inStruct.img[1] = "instr/instr_an_store_blue.png";

        // orange shop
        inStruct.txt[2] =
          "And the second one is the <b>orange animal store</b>. <br>";
        inStruct.img[2] = "instr/instr_an_store_orange.png";

        // what to do
        inStruct.txt[3] =
          "<b>The stores are located in different parts of the city.</b><br>Each store caters for a different customer base with unique preferences for certain features of the animals.<br> <b>Your task is to figure out what type of animals are preferred by customers of each store</b><<br> You do this by either accepting or rejecting animals for a given store, and then observing the reward/penalty incurred by your choice.";
        inStruct.img[3] = "";

        // trial - context
        inStruct.txt[4] =
          "Each trial begins with an image of the store you're currently in.";
        inStruct.img[4] = "instr/instr_an_store_blue.png";

        // trial - stimulus & mapping
        inStruct.txt[5] =
          "Shortly after, you'll see an image of an animal, together with the key assignment for that trial.<br> To communicate your decision, you'll press either the <b>F</b> or <b>J</b> key (corresponding to the left and right side of the screen).<br> The key mapping changes randomly from trial to trial.<br><br> In the example below, you'll use the <b>F</b> key to reject and the <b>J</b> key to accept an animal.";
        inStruct.img[5] = "instr/instr_an_store_blue_stim_fj.png";

        inStruct.txt[6] =
          "In contrast, if the locations of accept/reject were flipped as shown below, you''d instead use <b>F</b> to accept and <b>J</b> to reject an animal.";
        inStruct.img[6] = "instr/instr_an_store_blue_stim_jf.png";

        // trial - decision & feedback 1
        inStruct.txt[7] =
          "Right after you've pressed a button, we'll highlight your chosen option with a rectangle.<br>Let's assume that you decided to accept the animal.";
        inStruct.img[7] = "instr/instr_an_store_blue_accept.png";

        // trial - feedback 2
        inStruct.txt[8] =
          "After a short delay, you'll receive your reward/penalty. <br>This indicates if your choice was good or bad.<br> If you've bought/accepted an animal that is not liked by your customers, you'll receive a penalty<br>In contrast, if customers like your chosen animal, you'll receive a reward.";
        inStruct.img[8] = "instr/instr_an_store_blue_feedback.png";

        // trial - feedback 3
        inStruct.txt[9] =
          "You'll see a number on either side of the animal. <br> These are the rewards/penalties. <br> You will always receive a reward of zero for rejecting an animal...";
        inStruct.img[9] = "instr/instr_an_store_blue_feedback.png";

        // trial - feedback 4
        inStruct.txt[10] =
          "..and either a reward or a penalty for accepting an animal. <br> The value ranges from -50 to +50. <br> The chosen option will be highlighted by a rectangle.";
        inStruct.img[10] = "instr/instr_an_store_blue_feedback.png";

        // trial - feedback 5
        inStruct.txt[11] =
          "Remember: You want to accept animals that give a reward, and reject animals that would incur a penalty. <br> In the example below, we should have rejected the animal.";
        inStruct.img[11] = "instr/instr_an_store_blue_feedback.png";

        // reminder
        inStruct.txt[12] =
          "The reward/penalty depends on a feature that varies systematically across animals. <br> The relevant feature differs between the orange and blue store. <br> Your task is to figure our what these features might be. <br> Only accept those animals that give you a reward (= sell well). <br> Avoid the other animals that give you a penalty (don't sell well)!";
        inStruct.img[12] = "";

        // structure
        inStruct.txt[13] =
          "Now here is the catch! There will be a <b>training phase</b> and a <b>test phase</b>. <br> <b>In the test phase, we'll give you two new stores that sell vehicles instead of animals. </b> <br> Importantly, these vehicle stores are frequented by customers with similar preferences to those who go to the animal stores. <br> This means that you will be able to apply your knowledge about the animal stores to the vehicle stores. <br> You should only accept those vehicles that you think will be liked by your customers, and reject the others. <br> To make the job easier, we will give you feedback on some of the test trials, but not all of them.";
        inStruct.img[13] = "instr/instr_ve_both_stores.png";
        // summary
        inStruct.txt[14] =
          "<p><b> SUMMARY </b> <br>1. There are two animal stores during training, and two vehicle stores during the test phase. <br>2. Different types of animals sell best in each store. <br>3. Figure out which animals to accept and which to reject in each store.<br> 4. Transfer this knowledge to two vehicle stores in the test phase! <br> 5. Maximize your reward!<br></p>";
        inStruct.img[14] = "";
        break;

      case 2:
        inStruct.txt[0] =
          " Hi! <br> Thanks for taking part in this experiment! <br> Please use the buttons below to navigate through the instructions.";
        inStruct.img[0] = "";

        // blue shop
        inStruct.txt[1] =
          "Imagine that you've just started a new job as store manager. <br> You are responsible for two vehicle stores.<br>The first one is the <b>blue vehicle store</b>. <br>";
        inStruct.img[1] = "instr/instr_ve_store_blue.png";

        // orange shop
        inStruct.txt[2] =
          "And the second one is the <b>orange vehicle store</b>. <br>";
        inStruct.img[2] = "instr/instr_ve_store_orange.png";

        // what to do
        inStruct.txt[3] =
          "<b>The stores are located in different parts of the city.</b><br>Each store caters for a different customer base with unique preferences for certain features of the vehicles.<br> <b>Your task is to figure out what type of vehicles are preferred by customers of each store</b><<br> You do this by either accepting or rejecting vehicles for a given store, and then observing the reward/penalty incurred by your choice.";
        inStruct.img[3] = "";

        // trial - context
        inStruct.txt[4] =
          "Each trial begins with an image of the store you're currently in.";
        inStruct.img[4] = "instr/instr_ve_store_blue.png";

        // trial - stimulus & mapping
        inStruct.txt[5] =
          "Shortly after, you'll see an image of an vehicle, together with the key assignment for that trial.<br> To communicate your decision, you'll press either the <b>F</b> or <b>J</b> key (corresponding to the left and right side of the screen).<br> The key mapping changes randomly from trial to trial.<br><br> In the example below, you'll use the <b>F</b> key to reject and the <b>J</b> key to accept an vehicle.";
        inStruct.img[5] = "instr/instr_ve_store_blue_stim_fj.png";

        inStruct.txt[6] =
          "In contrast, if the locations of accept/reject were flipped as shown below, you''d instead use <b>F</b> to accept and <b>J</b> to reject an vehicle.";
        inStruct.img[6] = "instr/instr_ve_store_blue_stim_jf.png";

        // trial - decision & feedback 1
        inStruct.txt[7] =
          "Right after you've pressed a button, we'll highlight your chosen option with a rectangle.<br>Let's assume that you decided to accept the vehicle.";
        inStruct.img[7] = "instr/instr_ve_store_blue_accept.png";

        // trial - feedback 2
        inStruct.txt[8] =
          "After a short delay, you'll receive your reward/penalty. <br>This indicates if your choice was good or bad.<br> If you've bought/accepted an vehicle that is not liked by your customers, you'll receive a penalty<br>In contrast, if customers like your chosen vehicle, you'll receive a reward.";
        inStruct.img[8] = "instr/instr_ve_store_blue_feedback.png";

        // trial - feedback 3
        inStruct.txt[9] =
          "You'll see a number on either side of the vehicle. <br> These are the rewards/penalties. <br> You will always receive a reward of zero for rejecting an vehicle...";
        inStruct.img[9] = "instr/instr_ve_store_blue_feedback.png";

        // trial - feedback 4
        inStruct.txt[10] =
          "..and either a reward or a penalty for accepting an vehicle. <br> The value ranges from -50 to +50. <br> The chosen option will be highlighted by a rectangle.";
        inStruct.img[10] = "instr/instr_ve_store_blue_feedback.png";

        // trial - feedback 5
        inStruct.txt[11] =
          "Remember: You want to accept vehicles that give a reward, and reject vehicles that would incur a penalty. <br> In the example below, we should have rejected the vehicle.";
        inStruct.img[11] = "instr/instr_ve_store_blue_feedback.png";

        // reminder
        inStruct.txt[12] =
          "The reward/penalty depends on a feature that varies systematically across vehicles. <br> The relevant feature differs between the orange and blue store. <br> Your task is to figure our what these features might be. <br> Only accept those vehicles that give you a reward (= sell well). <br> Avoid the other vehicles that give you a penalty (don't sell well)!";
        inStruct.img[12] = "";

        // structure
        inStruct.txt[13] =
          "Now here is the catch! There will be a <b>training phase</b> and a <b>test phase</b>. <br> <b>In the test phase, we'll give you two new stores that sell animals instead of vehicles. </b> <br> Importantly, these animal stores are frequented by customers with similar preferences to those who go to the vehicle stores. <br> This means that you will be able to apply your knowledge about the vehicle stores to the animal stores. <br> You should only accept those animals that you think will be liked by your customers, and reject the others. <br> To make the job easier, we will give you feedback on some of the test trials, but not all of them.";
        inStruct.img[13] = "instr/instr_an_both_stores.png";
        // summary
        inStruct.txt[14] =
          "<p><b> SUMMARY </b> <br>1. There are two vehicle stores during training, and two animal stores during the test phase. <br>2. Different types of vehicles sell best in each store. <br>3. Figure out which vehicles to accept and which to reject in each store.<br> 4. Transfer this knowledge to two animals stores in the test phase! <br> 5. Maximize your reward!<br></p>";
        inStruct.img[14] = "";
        break;
    }
  } else if (task_id == "arena_task") {
    inStruct.txt = []; // content
    inStruct.img = []; // illustration
    // welcome (suboptimal, as I define this also in the html)
    inStruct.txt[0] =
      "<br> You'll now receive detailed instructions for the next task. <br> Please use the buttons below to navigate through these instructions.";
    inStruct.img[0] = [];

    // whereami
    inStruct.txt[1] =
      "Congratulations, you're almost done!<br>You're now in the arena task phase of the experiment.";
    inStruct.img[1] = "instructions/taskstructure_arena.png";

    // basics
    inStruct.txt[2] =
      "In this part of the experiment, you'll have to arrange stimuli on the screen such that the distances between them reflect how dissimilar they appear to be from each other. <br><br> At the beginning of each trial, you'll see a grey arena with 25 stimuli that are arranged in a circle.<br>";
    inStruct.img[2] = "instructions/canvas.png";

    // drag and drop
    inStruct.txt[3] =
      "If you click with the left mouse button on a stimulus and hold down the button, you're able to move the stimulus around within the grey area. <br><br> Release the button to confirm your selection.<br><br> The animation below illustrates how this looks like in practice.";
    inStruct.img[3] = "instructions/dragndrop.gif";

    // dissim ratings
    inStruct.txt[4] =
      "If you think that two stimuli are quite similar to each other, move them close together. If they appear to be dissimilar, make sure they're far apart from each other.<br> You'll have to do this for <b>ALL</b> 25 stimuli before you move on. That is, in your final arrangement, the distance between any two stimuli should reflect the subjective dissimilarity. <br> Please have a look at the example below for clarification.";
    inStruct.img[4] = "instructions/arrange.gif";

    // next
    inStruct.txt[5] =
      "Once you're satisfied with the arrangement, press the green <b>Next Trial</b> button at the bottom of the page. <br>You'll then proceed with the next trial, where you'll be asked to perform the same task with a slightly different set of stimuli. <br> Please note that the arrangement in the example below is arbitrary and doesn't contain any useful information for you to complete the task :)";
    inStruct.img[5] = "instructions/proceed.gif";

    // sunnary
    inStruct.txt[6] =
      "<b>Summary </b><br><br>1. On each trial, you'll see 25 stimuli that are arranged in a circle. <br><br>2. Your task is to change the arrangement until the distances between all 25 stimuli reflects the pairwise dissimilarities.<br><br>3. Once you're satisfied with your arrangement, you'll click the next trial button to proceed with a new set of stimuli.<br><br><br> <b>There will be six trials in total and it shouldn't take you longer than 15 minutes to finish this first phase of the experiment.<br>If you're ready to begin with the experiment, press the red start button below!</b>";

    inStruct.img[6] = [];
  }
}

function gotoNextPage() {
  /*
	  changes div to next entry in instruction array
  */
  // move forward
  pageIDX++;
  changeInstructions();
  changeButtons();
}

function gotoPrevPage() {
  /*
	  changes div to previous entry in instruction array
  */
  // move backward
  pageIDX--;
  changeInstructions();
  changeButtons();
}

function changeInstructions() {
  /*
	  changes div content via html injection
  */

  $(".bodyText").html(inStruct.txt[pageIDX]);
  if (inStruct.img[pageIDX].length > 0) {
    $(".bodyImg").html("<img id=instr_img src=" + inStruct.img[pageIDX] + ">");
  } else $(".bodyImg").html("<!-- nothing to see here -->");
}

function changeButtons() {
  /*
	  changes properties of buttons 
  */
  console.log(pageIDX);

  if (pageIDX == 0) {
    $("#prevButton").prop("disabled", true);
  } else {
    $("#prevButton").prop("disabled", false);
  }

  if (pageIDX == inStruct.txt.length - 2) {
    $("#nextButton").text("Next Page");
    $("#nextButton").off("click");
    $("#nextButton").attr("onclick", "gotoNextPage()");
    $(".buttonBox#nextButton").css("background-color", "rgba(249,167,50,1)");
  }
  if (pageIDX == inStruct.txt.length - 1) {
    $("#nextButton").text("Start");
    $("#nextButton").off("click");
    // $("#nextButton").attr("onclick", "goWebsite(html_task);newExperiment()");
    if (instr_id == "arena_task") {
      $("#nextButton").attr("onclick", "startDissimRatingExperiment()");
    } else if (instr_id == "main_task") {
      $("#nextButton").attr("onclick", "startMainExperiment()");
    }
    $(".buttonBox#nextButton").css("background-color", "red");
  }
}
