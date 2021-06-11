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
    console.log(preloadImages.cache.length)
    newExperiment();
    
  });
}


function gen_imgList() {
/*
  generates list of filenames
*/
  imglist = [];

  // instructions:
 
  // orchards:
  imglist.push(parameters.gardenURL + "orchard_north.png");
  imglist.push(parameters.gardenURL + "orchard_south.png")

 
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

