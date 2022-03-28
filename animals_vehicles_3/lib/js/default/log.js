
<!-- Transfer Global methods -->
function logStart(taskname,idname) {
  alldata = {
    task: taskname,
    id:   idname
  };
  // $.post("../../../cgi-bin/pl/log_start.pl",alldata);
  $.post("lib/php/log_start.php",alldata);
}

function logWrite(alldata) {
  // $.post("../../../cgi-bin/pl/log_write.pl",alldata);
  $.post("lib/php/log_write.php",alldata);
}

function bonusWrite(alldata) {
  $.post("../../../cgi-bin/pl/bonus_write.pl",alldata);
}

<!-- Transfer Local methods -->
function logStartLocal(taskname,idname) {
  alldata = {
    task: taskname,
    id:   idname
  };
  $.post("../../../cgi-bin/pl/locallog_start.pl",alldata);
}

function logWriteLocal(alldata) {
  $.post("../../../cgi-bin/pl/locallog_write.pl",alldata);
}

function bonusWriteLocal(alldata) {
  $.post("../../../cgi-bin/pl/localbonus_write.pl",alldata);
}
