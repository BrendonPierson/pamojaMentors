(function() {
  'use strict';

  angular.module('application')
    .controller('ThankYouCtrl', ThankYouCtrl);

  ThankYouCtrl.$inject = ["FBREF", "$http", "$stateParams", "FoundationApi"];

  function ThankYouCtrl(FBREF, $http, $stateParams, foundationApi) {
    var vm = this;

    console.log("admin");
    
    var ref = new Firebase(FBREF);

    $http.get(FBREF + 'participants.json').then(function(response) {
      console.log(response.data);
      vm.participants = response.data;
    }, function(err) {
      console.log(err);

    });
    
   

  }
})();
