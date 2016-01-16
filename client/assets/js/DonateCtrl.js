(function() {
  'use strict';

  angular.module('application')
    .controller('DonateCtrl', DonateCtrl);

  DonateCtrl.$inject = ["FoundationApi", "FBREF", "$firebaseObject"];

  function DonateCtrl(foundationApi, FBREF, $firebaseObject) {
    var vm = this;

    var ref = new Firebase(FBREF);

    vm.donations = $firebaseObject(ref.child('totalDonations'));

    vm.goToPaypal = function() {
      foundationApi.publish('main-notifications', { title: 'Redirecting', content:  'You will be taken to paypal to complete the donation.', autoclose: '3000' });
    }

  }
})();
