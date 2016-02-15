(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantCtrl', ParticipantCtrl);

  ParticipantCtrl.$inject = ["$http", "FBREF", "$stateParams", "FoundationApi"];

  function ParticipantCtrl($http, FBREF, $stateParams, foundationApi) {
    var vm = this;

    var ref = new Firebase(FBREF);

    $http.get(FBREF + "/participants/" + $stateParams.id + '/.json').then(success, failure);

    function success(response) {
      vm.participant = response.data;
    }

    function failure(err) {
      console.log(err);
    }

    vm.goToPaypal = function() {
      foundationApi.publish('main-notifications', {
        title: 'Redirecting',
        content: 'You will be taken to paypal to complete the donation.',
        autoclose: '3000'
      });
    }
  }
})();
