/*
Timo Flesch, 2016 [timo.flesch@gmail.com]
*/

/*
time course of exp:
*/

//  1. INIT
drawContext('north',0); // unblurred version
drawContext('south',0);
hideContext('north',0);
hideContext('south',0);
drawContext('north',1); // blurred version
drawContext('south',1);
hideContext('north',1);
hideContext('south',1);


drawTree(); // draw dummy stimulus
hideTree(); 
drawKeys(params.keyAssign); // arrow keys with labels
hideKeys();


drawChoiceRect();      // rect left and right around key/reward
hideChoiceRect('all'); // ['all','left','right']
drawAction('all');     // labels in bold, tree in garden or still in centre
hideAction();

drawReward(params.keyAssign); // draw dummies for reward/penalty depending on key assignment
hideReward();


// 2. EXP Loop

updateTrial();
showTrial();
hideTrial();
evalTrial();




/*
time course of trial:
*/

updateStimulus(); // make new tree object

showFixation();
showContext();
showStimulus();
evalResponse();
showAction();
showFeedback();

removeStimulus();  //remove tree object 
removeAction();

/*
 tree object 
*/

tree 
this.show 
this.plant 
this.rej 
this.grow 
this.die 
this.hide 
