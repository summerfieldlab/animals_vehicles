function startLoading() {
/*
  is supposed to preload images
*/

// found this snippet on the web, added callback
function preloadImages(srcs, continueExp) {
    if (!preloadImages.cache) {
        preloadImages.cache = [];
    }
    var img;
    for (var i = 0; i < srcs.length; i++) {
        img = new Image();
        img.src = srcs[i];
        preloadImages.cache.push(img);

    }
      continueExp();
}

var list =  gen_imgList();

// load images and execute callback once finished
preloadImages(list, function() {
  console.log(preloadImages.cache.length)
  // if (preloadImages.cache.length==list.length){
      newExperiment();
   // }
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

  // trees:
  exemplarList = parameters.exemplar_ids_train.concat(parameters.exemplar_ids_test)
  
  for(var b=1; b<=parameters.nb_branchiness; b++) {
    for(var l=1; l<=parameters.nb_leafiness; l++) {
      for(var e=1; e<=exemplarList.length; e++) {
          imglist.push(parameters.treeURL + "B" + b.toString() + "L" + l.toString() + "_" + exemplarList[e-1] + ".png")
      }
    }
  }
  return imglist;
}

