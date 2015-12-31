(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantCtrl', ParticipantCtrl);

  ParticipantCtrl.$inject = ["$http", "FBREF", "$stateParams", "FoundationApi"];

  function ParticipantCtrl($http, FBREF, $stateParams, foundationApi) {
    var vm = this;

    console.log($stateParams.id);

    var ref = new Firebase(FBREF);

    $http.get(FBREF + "/participants/" + $stateParams.id + '/.json').then(success, failure);

    function success (response) {
      console.log(response.data);
      vm.participant = response.data;
    }

    function failure (err) {
      console.log(err);
    }

    vm.goToPaypal = function() {
      console.log("go to goToPaypal fired");
      foundationApi.publish('main-notifications', { title: 'Redirecting', content:  'You will be taken to paypal to complete the donation.', autoclose: '3000' });
    }

  }
})();
