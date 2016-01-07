var express = require('express');
var app = express();
var http = require('http');
var querystring = require('querystring');

var pp_hostname = "https://www.sandbox.paypal.com"; // Change to www.sandbox.paypal.com to test against sandbox


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/build'));

app.get('/thankyou', function (req, res) {
  console.log('REQ  REQ  REQ  REQ  REQ  REQ  REQ  REQ  REQ  REQ  REQ  REQ  REQ  REQ');
  console.log(req);
  var tx = req.query.tx;
  console.log("TX TX TX TX TX TX TX" + tx);
  ppHandshake(tx);

});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  console.log('Node app is running on port', app.get('port'));
});

function ppHandshake(tx) {
  var body = {
    tx: tx,
    at: process.env.IDENTITY
  };
  
  var postData = querystring.stringify({
    tx : tx,
    at: process.env.IDENTITY
  });
  
  var options = {
    hostname: pp_hostname,
    port: 80,
    path: "/cgi-bin/webscr",
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
    res.on('end', function() {
      console.log('No more data in response.')
    })
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

  



