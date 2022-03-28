/* **************************************************************************************

Math Helper Functions
(c) Timo Flesch, 2016/17 
Summerfield Lab, Experimental Psychology Department, University of Oxford

************************************************************************************** */


function math_cos(phi) {
/*
	cosine in degrees
*/	
	return (Math.cos(phi*Math.PI/180));
}


function math_sin(phi) {
/*
	sine in degrees
*/	
	return (Math.sin(phi*Math.PI/180));
}


function math_linspace(min,spacing,max) {	
/*
	some sort of javascript port of MATLAB's linspace function
*/	
	vect = [];
	while(min<max) {
		vect.push(min);
		min = min+spacing;
	}
	return vect;
}


function math_euclidean(v1,v2){
/*
	computes euclidean distance between vectors v1 and v2
*/

	return Math.sqrt(Math.pow(v1[0]-v2[0],2)+Math.pow(v1[1]-v2[1],2));
}
