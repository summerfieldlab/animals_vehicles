/*
Timo Flesch, 2016 [timo.flesch@gmail.com]
*/
function trainingInstructions() {
  coding.hierarchy.order = shuffle(listDimension())
  coding.loop.now        = {}
  coding.loop.now.perm   =  randperm(7),
  coding.loop.now.feat   =  index([1,2,0,0,0,0,0],coding.loop.now.perm)
  coding.loop.now.indx   =  []
  coding.loop.now.init   =  index([0,2,0,0,0,0,0],coding.loop.now.perm)
  coding.loop.now.qery   =  index([1,0,1,0,0,0,0],coding.loop.now.perm)
  coding.loop.now.resp   =  index([0,2,0,0,0,0,0],coding.loop.now.perm)
  updateCodingButton()

  // feat = {}
  // feat.ord  = shuffle(coding.ponies.feat.ord),
  // feat.ind  = {skin:randperm(2), mane:randperm(2), horn:randperm(2), glasses:randperm(2), tail:randperm(2), anklet:randperm(2), hoof:randperm(2)},
  // feat.rrot = randi(7)}
  // feat.resp = rotate([1,1,2].concat(zeros(4)),feat.rrot);
  // feat.vbxi = rotate([1,1,2].concat(zeros(4)),feat.rrot+1);
  // feat.feed = vequal(feat.resp,feat.vbxi);

  var instructions = [];

  // welcome!
  instructions[00] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreateTrainingText(args) },
                        args: [ 'Hello!',
                                'And thank you for your participation.']})
  // basic idea
  instructions[01] = ({ func: instructions[00].func,
                        args: ['In this experiment you will see\nsets of ponies.',
                               '',
                               'We will now explain in detail what you\'re meant to do!',
                               '',
                               'Please read carefully.']})
  // pony
  instructions[02] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony()
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args)) },
                        args: [ 'All ponies will look like this,',
                                'but they can have additional features.']})

  // show features
  var inst_feature = {inst : [],
                      func : function(args) {
                        boardCreatePaper()
                        boardCreateBackground()
                        boardCreatePony(2)
                        var n_feat = max(mat2vec(coding.hierarchy.feat))
                        var o_feat = randperm(n_feat)
                        var l_feat = dix2dix(["SKINS","MANES","HORNS","GLASSES","TAILS","ANKLETS","HOOVES"],'vix2hix')
                        var fold = repmat("ponies",7)
                        var feat = []
                        for (var i = 0; i < n_feat; i++) {
                          feat = zeros(7); feat[args[0]] = o_feat[i]+1; updateBoardPony(feat,fold,i);
                        }
                        boardCreateTrainingTextY([board.ponies[0].top,
                                                  'For example,\n'+sprintf('ponies can have one of these %s.',l_feat[args[0]])])
                    } }
  for (var i = 0; i < 7; i++) {
    inst_feature.inst[i] = {func: inst_feature.func,
                            args:[i]
  } }
  instructions = instructions.concat(inst_feature.inst)
  delete inst_feature

  // pony example
  instructions[10] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony()
                                updateBoardPony(args[0],repmat("ponies",7));
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args.slice(1))) },
                        args: [ coding.loop.now.feat,
                                'Ponies always have exactly TWO features.',
                                'For example, one pony could look like this.']})

  // cue and task
  instructions[11] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony()
                                updateBoardPony(args[0],repmat("ponies",7));
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args.slice(1))) },
                        args: [ coding.loop.now.init,
                                'On each trial you will see a pony\nand only one feature.',
                                'YOUR JOB is to figure out what is the other (missing) feature!']})

  // buttons
  instructions[12] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreateButton(); updateBoardButton()
                                boardCreatePony();   updateBoardPony(args[0],repmat("ponies",7));
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args.slice(1))) },
                        args: [ coding.loop.now.init,
                                'You will see four buttons on the left side.',
                                'You will press with the mouse on one of them to\nselect your response.']})

  // countdown
  instructions[13] = ({ func: function(args) {
                                instructions[12].func(args)
                                boardCreateCountdown()
                                startCountdown(0,parameters.time.response,parameters.time.response/1000) },
                        args: [ coding.loop.now.init,
                                'You will see a small circle on the right side.',
                                'This is a countdown that indicates\nhow much time left you have to respond.',
                                'Don\'t take too long!']})

  // response
  instructions[14] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony()
                                coding.loop.now.resp = args[0]; updateBoardPonyResponse()
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args.slice(1))) },
                        args: [ index([0,2,1,0,0,0,0],coding.loop.now.perm),
                                'Once you click on a button,\nthe response will be displayed on screen for a short time.']})

  // incorrect
  instructions[15] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony()
                                coding.loop.now.resp = args[0]; updateBoardPonyResponse()
                                updateBoardPonyTarget(0,true)
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args.slice(1))) },
                        args: [ index([0,2,1,0,0,0,0],coding.loop.now.perm),
                                'Then, the *correct* response will be displayed on screen.\nIn other words, these are the real features of the pony.',
                                'Also, if your response is incorrect, the frame will turn red.',]})

  // incorrect
  instructions[16] = ({ func: instructions[15].func,
                        args: [ coding.loop.now.feat,
                                'If your response is correct, the frame will turn green instead.',
                                'You will then click on the pony to move forward to the next trial.',]})

  // ambiguity
  instructions[17] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony(2)
                                var fold = repmat("ponies",7)
                                updateBoardPony(index([1,2,0,0,0,0,0],coding.loop.now.perm),fold,0)
                                updateBoardPony(index([1,1,0,0,0,0,0],coding.loop.now.perm),fold,1)
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args.slice(1))) },
                        args: [ coding.loop.now.feat,
                                'Two ponies can share a feature.',
                                'Because of this, sometimes it will be\nimpossible to tell what is the correct feature!']})

  // pony sets
  instructions[18] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony(4)
                                var fold = repmat("ponies",7)
                                updateBoardPony(index([1,2,0,0,0,0,0],coding.loop.now.perm),fold,0)
                                updateBoardPony(index([1,1,0,0,0,0,0],coding.loop.now.perm),fold,1)
                                updateBoardPony(index([2,0,1,0,0,0,0],coding.loop.now.perm),fold,2)
                                updateBoardPony(index([2,0,2,0,0,0,0],coding.loop.now.perm),fold,3)
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args)) },
                        args: ['Remember that within each set there will only be four ponies.',
                               'On each trial you will see one of these four ponies chosen at random.\nAfter a few trials, you should be able to remember all four ponies.']})

  // blocks
  instructions[19] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony(4)
                                var fold = repmat("ponies",7)
                                updateBoardPony(index([1,2,0,0,0,0,0],coding.loop.now.perm),fold,0)
                                updateBoardPony(index([1,1,0,0,0,0,0],coding.loop.now.perm),fold,1)
                                updateBoardPony(index([2,0,1,0,0,0,0],coding.loop.now.perm),fold,2)
                                updateBoardPony(index([2,0,2,0,0,0,0],coding.loop.now.perm),fold,3)
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args)) },
                        args: ['However, there are so little trials within each block that memorising the ponies wont be enough!\nEvery few trials, a new block will start and you will need to learn new ponies.',
                               'Luckily, all sets of ponies have something abstract in common. Try to figure out what it is!',
                               'If you do, will be able to perform well and obtain a high score.']})

  // evaluation
  instructions[20] = ({ func: instructions[0].func,
                        args: ['Additionally, half of the blocks will be shorter and only provide minimum feedback.',
                               'In those, you will only be able to perform well if you acquire this abstract knowledge.',
                               sprintf('You can earn a bonus of $%.2f only from these short blocks!',parameters.bonus_score)]})
  instructions[21] = ({ func: instructions[0].func,
                        args: ['We will let when you start one of these evaluation blocks.',
                               'Also, at the end you will see how much bonus you\'ve earned so far.']})

  // no feedback
  instructions[22] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony()
                                coding.loop.now.resp = args[0]; updateBoardPonyResponse()
                                updateBoardPonyTarget(0,false)
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args.slice(1))) },
                        args: [ index([0,2,1,0,0,0,0],coding.loop.now.perm),
                                'In the evaluation blocks, for those trials where you dont receive feedback,',
                                'the frame will turn gray and your response will stay on screen.',]})

  // set display
  instructions[23] = ({ func: instructions[19].func,
                        args: [ 'At the end of each block we will show you what the set of ponies was.',
                                'Pay close attention !']})

  // counters
  instructions[24] = ({ func: function(args) {
                                boardCreatePaper()
                                boardCreateBackground()
                                boardCreatePony()
                                boardCreateCounter()
                                board.counter.text = sprintf(board.counter.expression,1,parameters.phase.trial[1],1,parameters.phase.trial.length)
                                board.counter.object.attr({"text": board.counter.text});
                                board.counter.object.attr({x: board.counter.centre[0]})
                                boardCreateClock(),
                                boardCreateTrainingTextY([board.ponies[0].top].concat(args)) },
                        args: ['During the experiment, a counter on the right side',
                               'will inform you of the amount of time spent',
                               'and the number of trials/blocks completed and in total.',
                               '',
                              ]})

  // good luck
  instructions[25] = ({ func: instructions[0].func,
                        args: ['That\'s it! We wish you good luck.',
                               'The experiment should take you less than one hour in total.',
                               '',
                               'If you have any problems please write us at\nneuronoodle@gmail.com']})

  // finish training
  instructions[instructions.length] = ({ func: finishTraining,
                                         args: []})
  return instructions
}
