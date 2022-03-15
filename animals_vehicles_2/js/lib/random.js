/* **************************************************************************************

Random Number Generators and Shufflers
(c) Timo Flesch, 2016/17 
Summerfield Lab, Experimental Psychology Department, University of Oxford

************************************************************************************** */

function rnd_randInt(min, max) {
/*
	returns random integer
*/	
  	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min;
}


function rnd_fisherYates(array) {
/*
	 Fisher Yates Shuffle Algorithm (copied from: http://bost.ocks.org/mike/shuffle/)
*/	 
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t        = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}


function rnd_randomSampling(inputVect,numSamples) {
/*
	returns random samples from input vector
*/	
  sampleVect   = [];
  samplingVect = inputVect.slice(); //make duplicate
  i= 0;
  while(sampleVect.length<numSamples){
    samplingVect = rnd_fisherYates(samplingVect);
    sampleVect[i] = samplingVect.pop(); 
    i++;
  }
  return sampleVect; 
}