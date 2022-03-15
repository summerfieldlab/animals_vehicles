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

function setInstructions() {
  /*
	  here I define my instructions
  */
  // goWebsite(html_taskinstr)
  // domaincode==1: first animals, then vehicles. domaincode==2: first vehicles, then animals
  switch (parameters.domaincode) {
    case 1:
      inStruct.txt[0] =
        " Hi! <br> Thanks for taking part in this experiment! <br> Please use the buttons below to navigate through the instructions.";
      inStruct.img[0] = "";

      // north orchard
      inStruct.txt[1] =
        "Imagine that you've just started a new job as store manager. <br> You are responsible for two animal stores.<br>The first one is the <b>blue animal store</b>. <br>";
      inStruct.img[1] = "instr/instr_an_store_blue.png";

      // south orchard
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
        "Now here is the catch! There will be a <b>training phase</b> and a <b>test phase</b>. <br> <b>In the test phase, we'll give you two new stores that sell vehicles instead of animals. </b> <br> Importantly, these vehicle stores are frequented by customers with similar preferences to those who go to the animal stores. <br> This means that you will be able to apply your knowledge about the animal stores to the vehicle stores. <br> You should only accept those vehicles that you think will be liked by your customers, and reject the others. <br> To make the job easier, we will give you feedback on some of the test trials, but not all of them."
      inStruct.img[13] = ""; //TODO insert vehicle stores image
      // summary
      inStruct.txt[14] =
        "<p><b> SUMMARY </b> <br>1. There are two animal stores during training, and two vehicle stores during the test phase. <br>2. Different types of animals sell best in each store. <br>3. Figure out which animals to accept and which to reject in each store.<br> 4. Transfer this knowledge to two vehicle stores in the test phase! <br> 5. Maximize your reward!<br></p>";
      inStruct.img[14] = "";
      break;

    case 2:
      inStruct.txt[0] =
        " Hi! <br> Thanks for taking part in this experiment! <br> Please use the buttons below to navigate through the instructions.";
      inStruct.img[0] = "";

      // north orchard
      inStruct.txt[1] =
        "Imagine that you've just started a new job as store manager. <br> You are responsible for two vehicle stores.<br>The first one is the <b>blue vehicle store</b>. <br>";
      inStruct.img[1] = "instr/instr_ve_store_blue.png";

      // south orchard
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
        "Now here is the catch! There will be a <b>training phase</b> and a <b>test phase</b>. <br> <b>In the test phase, we'll give you two new stores that sell animals instead of vehicles. </b> <br> Importantly, these animal stores are frequented by customers with similar preferences to those who go to the vehicle stores. <br> This means that you will be able to apply your knowledge about the vehicle stores to the animal stores. <br> You should only accept those animals that you think will be liked by your customers, and reject the others. <br> To make the job easier, we will give you feedback on some of the test trials, but not all of them."
      inStruct.img[13] = ""; //TODO insert vehicle stores image
      // summary
      inStruct.txt[14] =
        "<p><b> SUMMARY </b> <br>1. There are two vehicle stores during training, and two animal stores during the test phase. <br>2. Different types of vehicles sell best in each store. <br>3. Figure out which vehicles to accept and which to reject in each store.<br> 4. Transfer this knowledge to two animals stores in the test phase! <br> 5. Maximize your reward!<br></p>";
      inStruct.img[14] = "";
      break;
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
    $("#nextButton").attr("onclick", "goWebsite(html_task);newExperiment()");
    $(".buttonBox#nextButton").css("background-color", "red");
  }
}
