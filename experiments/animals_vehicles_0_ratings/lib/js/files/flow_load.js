function startLoading() {
/*
  is supposed to preload images
*/


  function preloadImages(srcs, continueExp) {
      if (!preloadImages.cache) {
          preloadImages.cache = [];
      }
      var img;
      var remaining = srcs.length;
      for (var i = 0; i < srcs.length; i++) {
          img = new Image();
          img.onload = function () {
              --remaining;

              
              if (remaining <= 0) {
                 console.log('all images cached');
                  continueExp();
              }
              
          };
          img.src = srcs[i];
          preloadImages.cache.push(img);
          // updateProgressPercent(i,srcs.length,continueExp);

      }        
  }

  var list =  gen_imgList();

  // load images and execute callback once finished
  preloadImages(list, function() {
    
    setExperiment();
    setInstructions();
    changeInstructions();
    goWebsite(html_taskinstr);
    startedinstructions=true;
    
  });
}


// function updateProgressPercent(i,imax,continueExp) {
// /*
// show progress with image caching as percent of images loaded.
// */
// if (i<imax){
//   loadprogress = Math.round(i/imax*100);

//   webfunc = function(data) {
//     document.getElementById("webbodyDiv").innerHTML = data;
//     document.getElementById("loadprogress").innerHTML = String(loadprogress) + " &percnt;";
//     coding.webfile = html_loading
//   }
//   $.post(html_loading,[],webfunc);
// }
// else {
//   continueExp()
// }
// }


function gen_imgList() {
/*
  generates list of filenames
*/
  imglist = [];

  // instructions:
  prefixes = ['al_','af_','vl_','vf_'];
  for(var ii=0; ii<prefixes.length; ii++) 
  {
    for(var jj=1; jj<=5; jj++)
    {
      imglist.push(params_exp.instr_dir + prefixes[ii] + jj + '.png');
    }
  }
  
  // cache all stimuli
  for(var i=1; i<=stim.names.length;i++) {
    imglist.push(params_exp.stim_dir + stim.names[i-1]);
  }

  return imglist;
}
