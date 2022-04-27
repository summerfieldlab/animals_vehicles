HAS_CHOSEN = false;

function set_ui() {
  /* 
    wrapper that adds ui elements and text
  */
  ui_setup_all();

}


function ui_setup_all() {
  /* 
    populates canvas with UI elements
  */
  goWebsite(html_likert);
  board.canvas = new Raphael(0,0,board.width,board.height);  
  // stimulus 
  ui_set_stimulus();
  // navigation 
  ui_set_navbuttn();
  // likert 
  ui_set_likert();
    
}

function ui_set_stimulus() {
  // places stimulus onto canvas 
  board.stimcanvas = new Raphael(window.innerWidth/2-200, window.innerHeight/2-300, 400,400)
  board.stimcanvas.rect(0, 0, "100%", "100%").attr({
    fill : params_ui.stim.fill,
    stroke : params_ui.stim.stroke,
    'stroke-width' : params_ui.stim.strokewidth,
    r : params_ui.stim.edgecurvature});
  board.stimulus = board.stimcanvas.image(params_exp.stim_dir + stim.names[numbers.trial_count],"5%","5%", "90%","90%")
}


function ui_set_likert() {
  /* 
    places likert scale on canvas
  */
  
  // question
  board.question = {};
  board.question = board.canvas.text(board.centre[0], board.centre[1]+140,
    params_ui.likert.question.content).attr({
      "font-family": params_ui.likert.question.font,
      "font-size": params_ui.likert.question.fontsize,	 
      "font-weight" : params_ui.likert.question.weight 
  })
  board.question.node.setAttribute("class","donthighlight");
  
  // background with colour gradient  (was 0-#f52905-#299e33)
  board.grad = {};
  board.grad = board.canvas.rect(board.centre[0]+params_ui.likert.locations[0]*1.2,
     board.centre[1]+180,(params_ui.likert.locations[0]*1.2)*-2, 90,5).attr({
       fill:params_ui.grad.fill,
       stroke:params_ui.grad.stroke,
       "stroke-width":params_ui.grad.strokewidth
     })

  // radio buttons
  
  board.likert = {};
  board.likert.buttons = []; 
  board.likert.selectors = []; 
  board.likert.texts   = [];
  board.likert.objects = [];
  
  for (let ii = 0; ii < params_ui.likert.locations.length; ii++) {
    
    // rect for button
    board.likert.buttons[ii] = board.canvas.circle(board.centre[0]+params_ui.likert.locations[ii], 
      board.centre[1]+230, 15).attr({
        fill: params_ui.likert.button.fill,
        stroke: params_ui.likert.button.stroke,
        'stroke-width': params_ui.likert.button.width
        });
    // radio button selector (dot)
    board.likert.selectors[ii] = board.canvas.circle(board.centre[0]+params_ui.likert.locations[ii], 
      board.centre[1]+230, 10).attr({
        fill: params_ui.likert.selector.fill,
        stroke: params_ui.likert.selector.stroke,
        'stroke-width': params_ui.likert.selector.width,
        "opacity": params_ui.likert.selector.opacity
        });
    board.likert.selectors[ii].active = false;
  
    // labels
    board.likert.texts[ii] = board.canvas.text(board.likert.buttons[ii].attrs.cx + 
      board.likert.buttons[ii].attrs.r * 0, board.likert.buttons[ii].attrs.cy - 
      board.likert.buttons[ii].attrs.r * 2, params_ui.likert.labels.content[ii]).attr({
        "font-family": params_ui.button.font,
        "font-size": params_ui.button.fontsize,	 
        "font-weight" : params_ui.likert.labels.weight        
        });
        board.likert.texts[ii].node.setAttribute("class","donthighlight")
    
    // collection
    board.likert.objects[ii] = board.canvas.set().attr({cursor: 'pointer'});
    board.likert.objects[ii].push(board.likert.buttons[ii]);
    board.likert.objects[ii].push(board.likert.texts[ii]);
    board.likert.objects[ii].push(board.likert.selectors[ii]);
    
    // mouse events
    board.likert.objects[ii].mouseover(function (event) {
      // on mouse over, let it glow:
      this.oGlow = board.likert.buttons[ii].glow({
          opacity: params_ui.likert.button.glow.opacity,
          color:   params_ui.likert.button.glow.colour,
          width:   params_ui.likert.button.glow.width
    });
    }).mouseout(function (event) {
      // remove glow on mouse-out:
      this.oGlow.remove();
    }).click(function (e) {
      // make sure that only one is active at any given time
      any_chosen = false;
      for (let jj = 0; jj < params_ui.likert.locations.length; jj++) {
        if(board.likert.selectors[jj].active) {
          any_chosen = true;
        }        
      }
      // if no radio button active, select current one
      if (!any_chosen) {
        board.likert.selectors[ii].attr({opacity : "100%"})
        board.likert.selectors[ii].active = true;
        // activate next_trial button
        navbuttn_activate();
      }
      // else if any other active, flush all and select current one
      else {
        for (let jj = 0; jj < params_ui.likert.locations.length; jj++) {
          board.likert.selectors[jj].active = false;
          board.likert.selectors[jj].attr({opacity : "0%"});
        }        
         
        board.likert.selectors[ii].attr({opacity : "100%"})
        board.likert.selectors[ii].active = true;
        

        // // activate next_trial button
        // navbuttn_activate();
      }      
    });    
  }
  
}



function ui_set_navbuttn() {
 /* 
  button to proceed to next trial
  */

  // visuals
  board.buttonBox = board.canvas.rect(window.innerWidth*0.8, 
    board.centre[1]+window.innerHeight*0.42, 160, 50, 5).attr({
          fill: params_ui.button.fill,
          stroke: params_ui.button.stroke,
          'stroke-width': params_ui.button.width
        });
  // label
  board.buttonText = board.canvas.text(board.buttonBox.attrs.x + 
    board.buttonBox.attrs.width / 2, board.buttonBox.attrs.y + 
    board.buttonBox.attrs.height / 2, 'Next Trial').attr({
          "font-family": params_ui.button.font,
          "font-size": params_ui.button.fontsize,	           
        });

  board.buttonText.node.setAttribute("class","donthighlight")

  // collection
  board.buttonObject = board.canvas.set().attr({cursor: 'pointer'});
  board.buttonObject.push(board.buttonBox);
  board.buttonObject.push(board.buttonText);

  // control flow during interaction (mouseover/out, click)
  board.buttonObject.mouseover(function (event) {
    if (HAS_CHOSEN) {
     this.oGlow = board.buttonBox.glow({
        opacity: params_ui.button.glow.opacity,
        color:   params_ui.button.glow.colour,
        width:   params_ui.button.glow.width
      });
    }
  }).mouseout(function (event) {
    if (HAS_CHOSEN) {
      this.oGlow.remove();
    }
  }).click(function (e) {
    if (HAS_CHOSEN) {
      experiment_next_trial();	      
      this.oGlow.remove();
      navbuttn_deactivate();
    }
  });
  navbuttn_deactivate();
}

function navbuttn_deactivate () {
  HAS_CHOSEN = false;  
  board.buttonBox.node.setAttribute("opacity", "20%");
  board.buttonText.node.setAttribute("opacity", "20%");

}

function navbuttn_activate () {
  board.buttonBox.node.setAttribute("opacity", "100%");
  board.buttonText.node.setAttribute("opacity", "100%");

  // board.buttonBox.glow({
  //   opacity: params_ui.button.glow.opacity,
  //   color:   "green",
  //   width:   params_ui.button.glow.width
  // });
  HAS_CHOSEN = true;

}

function ui_set_labels(){
  /*
    sets labels depending on task
  */ 

    // labels of radio buttons
    var likert_labels = document.getElementsByClassName('Items');
    for(var ii=0; ii<params_ui.n_items; ii++){
        likert_labels[ii].innerText=params_ui.labels[ii];
    }

    // question above radio buttons
    q = document.getElementById("question");
    q.innerText = params_exp.question;
}


function ui_reset_buttons() {
 /*
 resets radio buttons
 */
  for (let jj = 0; jj < params_ui.likert.locations.length; jj++) {
    board.likert.selectors[jj].active = false;
    board.likert.selectors[jj].attr({opacity : "0%"});
  }     
}


function ui_get_responses() {
  /*
    queries status of all radio boxes (i.e. whether or not checked)
  */

  response = '';
  for (let ii = 0; ii<board.likert.selectors.length; ii++) {
    if (board.likert.selectors[ii].active) {
      response = ii+1;
    }    
  }
  return response;
}



function experiment_removeUI() {

  board.stimcanvas.remove()
  board.canvas.remove();
  // stopClock();
  //document.getElementById("wrap").innerHTML = '<div style="text-align:center;"">Thanks for taking part!</div>';


}
