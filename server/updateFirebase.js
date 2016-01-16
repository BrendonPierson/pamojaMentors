'use strict';

var Firebase = require('firebase');
var ref = new Firebase(process.env.FBURL);

let updateFirebase = function(req) {

  ref.child('rawTransactions').push(req.body, () => {
    console.log("successfully pushed donation to fb");
  });

  if(req.body['txn_type'] === 'web_accept') {
    let payment_amount = Number(req.body['mc_gross']);

    // Leave out any sensitive information when the data is stored on the participant
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
    ref.child('totalDonations').child('2016').transaction( money => Number(money) + payment_amount); 
    ref.child('totalDonations').child('cumulative').transaction( money => Number(money) + payment_amount); 
    ref.child('participants').child(donation.item_number).child('moneyRaised').transaction( money => Number(money) + payment_amount);  
  } else if(req.body['txn_type'] === 'recurring_payment') {
    ref.child('recurringPayments').child(req.body['recurring_payment_id']).child('donations').push({
      amount: Number(req.body['mc_gross']),
      time_created: req.body['time_created'],
      name: req.body['product_name']
    });
  } else if(req.body['txn_type'] === 'recurring_payment_profile_created') {
    ref.child('recurringPayments').child(req.body['recurring_payment_id']).set(req.body);
  }
}

module.exports = updateFirebase;