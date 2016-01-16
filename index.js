'use strict';
const express = require('express');
const app = express();
const querystring = require('querystring');
const request = require('request');
const bodyParser = require('body-parser');
const Auth = require('./server/auth');
const auth = new Auth();
const updateFirebase = require('./server/updateFirebase');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/build'));

app.post('/ipn', function(req, res) {

  if(!auth.isAuth()) {
    auth.signIn();
  }
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

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {

      // inspect IPN validation result and act accordingly
      if (body.substring(0, 8) === 'VERIFIED') {
        // The IPN is verified, process it
        console.log('Verified IPN!');
        console.log('\n\n');

        updateFirebase(req);

      } else if (body.substring(0, 7) === 'INVALID') {
        // IPN invalid, log for manual investigation
        console.log('Invalid IPN!');
        console.log('\n\n');
      }
    }
  });
});

const server = app.listen(app.get('port'), function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  console.log('Node app is running on port', app.get('port'));
});
