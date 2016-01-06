var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/build'));

// app.get('/', function(request, response) {
//   response.send('<p>some html</p>');
// });

app.post('/thankyou', function (req, res) {
  res.send('POST request to the homepage');
});

// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);
// });

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  console.log('Node app is running on port', app.get('port'));
});
