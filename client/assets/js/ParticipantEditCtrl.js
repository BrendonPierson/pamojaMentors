(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantEditCtrl', ParticipantEditCtrl);

  ParticipantEditCtrl.$inject = ["FBREF", "$http", "$stateParams", "$firebaseObject", "FoundationApi"];

  function ParticipantEditCtrl(FBREF, $http, $stateParams, $firebaseObject, foundationApi) {
    var vm = this;

    var ref = new Firebase(FBREF);

    $http.get(FBREF + "/participants/" + $stateParams.id + '/.json').then(success, failure);

    function success (response) {
      vm.participant = response.data;
    }

    function failure (err) {
      console.log(err);
    }

    vm.saveParticipant = function() {
      ref.child('participants').child(vm.participant.uid).set(vm.participant, savedSuccessfully);
    }
    
    function savedSuccessfully(){
      foundationApi.publish('main-notifications', { title: 'Saved Successfully', content:  "Participant: " + vm.participant.fName + " " + vm.participant.lName, autoclose: '3000', color: 'success' });
    }

  }
})();
