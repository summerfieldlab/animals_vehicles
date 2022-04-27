function io_save_data() {
  // first, build data structure
  var data = {
    stimtype: params_exp.stimype,
    feature: params_exp.feature,
    trial_ids:  results.stim_id,
    images: results.img,
    responses: results.responses
  };
  // second, convert data to JSON and send to backend
  $.ajax({
    type : "POST",
    url : "../lib/php/io.php",
    data : {
        json : JSON.stringify(data)
    }
  });
}



function getQueryParams() {
    var qs = document.location.search.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}
