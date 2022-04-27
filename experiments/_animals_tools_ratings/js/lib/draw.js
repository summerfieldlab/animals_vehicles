/* **************************************************************************************

Draw Helper Functions from jdobalaguer [at] gmail [dot] com
Summerfield Lab, Experimental Psychology Department, University of Oxford

************************************************************************************** */
 

function drawPaper(rect) {
  var object = Raphael(rect[0],rect[1],rect[2],rect[3]);
  return object;
}

function drawRect(paper,rect) {
  var object = paper.rect(rect[0],rect[1],rect[2],rect[3]);
  return object;
}

function drawImage(paper,src,rect) {
  var object = paper.image(src,rect[0],rect[1],rect[2],rect[3]);
  return object;
}

function drawText(paper,center,text) {
  var object = paper.text(center[0],center[1],text);
  return object;
}

function drawPath(paper,path) {
  var object = paper.path(path);
  return object;
}

function drawEllipsoid(paper,rect) {
  var object = paper.ellipse(rect[0]+rect[2],rect[1]+rect[3],2*rect[2],2*rect[3]);
  return object;
}
