
function fileWrite(towards,content,func) {
  var result = $.post("../../../cgi-bin/pl/file_write.pl",{towards: towards, content: content});
  result.done(func);
}

function fileRead(from,func) {
  var result = $.post("../../../cgi-bin/pl/file_read.pl",{from: from});
  result.done(func);
}

function fileList(from,func) {
  var result = $.post("../../../cgi-bin/pl/file_list.pl",{from: from});
  result.done(func);
}

function fileMove(from,towards,func) {
  var result = $.post("../../../cgi-bin/pl/file_move.pl",{from:from, towards: towards});
  result.done(func);
}
