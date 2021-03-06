(function() {
  'use strict';

  angular.module('application')
    .controller('ThankYouCtrl', ThankYouCtrl);

  ThankYouCtrl.$inject = ["FBREF", "$http", "$stateParams", "FoundationApi"];

  function ThankYouCtrl(FBREF, $http, $stateParams, foundationApi) {
    var vm = this;
    vm.amount = $stateParams.amount;

    var ref = new Firebase(FBREF);

    $http.get(FBREF + 'participants/' + $stateParams.id + '.json').then(function(response) {
      vm.participant = response.data;
      foundationApi.publish('main-notifications', { title: 'Success!', autoclose: '3000', color: "success" });
    }, function(err) {
      console.log(err);
    });
  }
})();


