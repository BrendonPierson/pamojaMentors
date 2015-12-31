(function() {
  'use strict';

  angular.module('application')
    .controller('DonateCtrl', DonateCtrl);

  DonateCtrl.$inject = ["FoundationApi"];

  function DonateCtrl(foundationApi) {
    var vm = this;

    vm.goToPaypal = function() {
      console.log("go to goToPaypal fired");
      foundationApi.publish('main-notifications', { title: 'Redirecting', content:  'You will be taken to paypal to complete the donation.', autoclose: '3000' });
    }

  }
})();
