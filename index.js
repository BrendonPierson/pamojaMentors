'use strict';
var express = require('express');
var app = express();
var http = require('http');
var querystring = require('querystring');
var Firebase = require('firebase');
var ref = new Firebase('https://pamoja.firebaseio.com/');
var request = require('request');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/build'));

app.post('/ipn', function(req, res) {
  console.log('Received POST /');
  console.log(req.body);
  console.log('\n\n');

  // STEP 1: read POST data
  req.body = req.body || {};
  res.status(200).send('OK');
  res.end();

  // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
  var postreq = 'cmd=_notify-validate';
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      var value = querystring.escape(req.body[key]);
      postreq = postreq + "&" + key + "=" + value;
    }
  }

  // Step 2: POST IPN data back to PayPal to validate
  console.log('Posting back to paypal');
  console.log(postreq);
  console.log('\n\n');
  var options = {
    url: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
    method: 'POST',
    headers: {
      'Connection': 'close'
    },
    body: postreq,
    strictSSL: true,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  };

  request(options, function callback(error, response, body) {
    if (!error && response.statusCode === 200) {

      // inspect IPN validation result and act accordingly
      if (body.substring(0, 8) === 'VERIFIED') {
        // The IPN is verified, process it
        console.log('Verified IPN!');
        console.log('\n\n');

        ref.child('rawDonations').push(req.body, function() {
          console.log("successfully pushed donation to fb");
        });

        ref.child('participants').child(req.body['item_number']).child('donations').push(req.body);
        ref.child('participants').child(req.body['item_number']).child('moneyRaised').transaction( money => Number(money) + Number(req.body['mc_gross']));

        // assign posted variables to local variables
        var item_name = req.body['item_name'];
        var item_number = req.body['item_number'];
        var payment_status = req.body['payment_status'];
        var payment_amount = req.body['mc_gross'];
        var payment_currency = req.body['mc_currency'];
        var txn_id = req.body['txn_id'];
        var receiver_email = req.body['receiver_email'];
        var payer_email = req.body['payer_email'];

        //Lets check a variable
        console.log("Checking variable");
        console.log("payment_status:", payment_status)
        console.log('\n\n');

        // IPN message values depend upon the type of notification sent.
        // To loop through the &_POST array and print the NV pairs to the screen:
        console.log('Printing all key-value pairs...')
        for (var key in req.body) {
          if (req.body.hasOwnProperty(key)) {
            var value = req.body[key];
            console.log(key + "=" + value);
          }
        }

      } else if (body.substring(0, 7) === 'INVALID') {
        // IPN invalid, log for manual investigation
        console.log('Invalid IPN!');
        console.log('\n\n');
      }
    }
  });
});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  console.log('Node app is running on port', app.get('port'));
});
