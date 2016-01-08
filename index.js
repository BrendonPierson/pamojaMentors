var express = require('express');
var app = express();
var http = require('http');
var querystring = require('querystring');
var Firebase = require('firebase');
var ref = new Firebase('https://pamoja.firebaseio.com/');

var pp_hostname = "https://www.sandbox.paypal.com/"; // Change to www.paypal.com to test against sandbox


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/build'));

app.get('/thankyou', function (req, res) {
  var tx = req.query.tx;
  ppHandshake(tx);
});

app.post('/thankyou', function (req, res) {
  var amount = Number(req.query.amt.split('%2e').join('.'));

  var donation = {
    transactionID: req.query.tx,
    message: req.query.cm,
    status: req.query.st,
    amount: amount,
    participant: req.query.item_number,
    sig: req.query.sig,
    date: Date.now()
  };

  ref.child('participants').child(donation.participant).child('moneyRaised').transaction(function(money) {
    return money + amount;
  });

  ref.child('participants').child(donation.participant).child('donations').child(donation.transactionID).set(donation);

  ref.child('donations').child(donation.transactionID).set(donation);

  res.redirect('/#!/thankyou?id=' + donation.participant + "&amount=" + donation.amount);
});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  console.log('Node app is running on port', app.get('port'));
});

function ppHandshake(tx) {
  
  var postData = querystring.stringify({
    cmd: "_notify-synch",
    tx : tx,
    at: process.env.IDENTITY
  });
  
  var options = {
    hostname: pp_hostname,
    port: 80,
    path: "cgi-bin/webscr",
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
      ref.child('papalData').push(chunk);
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

  



