'use strict';
let express = require('express');
let app = express();
let http = require('http');
let querystring = require('querystring');
let Firebase = require('firebase');
let ref = new Firebase('https://pamoja.firebaseio.com/');
let request = require('request');
let bodyParser = require('body-parser');

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
  let postreq = 'cmd=_notify-validate';
  for (let key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      let value = querystring.escape(req.body[key]);
      postreq = postreq + "&" + key + "=" + value;
    }
  }

  // Step 2: POST IPN data back to PayPal to validate
  console.log('Posting back to paypal');
  console.log(postreq);
  console.log('\n\n');
  let options = {
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

        ref.child('rawDonations').push(req.body, () => {
          console.log("successfully pushed donation to fb");
        });

        // Leave out any sensitive information when the data is stored on the participant
        let payment_amount = Number(req.body['mc_gross']);
        let donation = {
          item_name: req.body['item_name'],
          item_number: req.body['item_number'],
          payment_status: req.body['payment_status'],
          txn_id: req.body['txn_id'],
          fName: req.body['first_name'],
          city: req.body['address_city'],
          state: req.body['address_state'],
          date: Date.now(),
          payment_amount
        };

        ref.child('participants').child(donation.item_number).child('donations').push(donation);
        ref.child('participants').child(donation.item_number).child('moneyRaised').transaction( money => Number(money) + payment_amount);  
        
        //Lets check a variable
        console.log("Checking variable");
        console.log("payment_status:", donation.payment_status)
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
