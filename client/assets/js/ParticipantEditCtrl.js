(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantEditCtrl', ParticipantEditCtrl);

  ParticipantEditCtrl.$inject = ["FBREF", "$http", "$stateParams", "$firebaseObject", "FoundationApi"];

  function ParticipantEditCtrl(FBREF, $http, $stateParams, $firebaseObject, foundationApi) {
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

    vm.saveParticipant = function() {
      console.log("trying to save");
      ref.child('participants').child(vm.participant.uid).set(vm.participant, savedSuccessfully);
    }
    vm.archiveParticipant = function() {
      console.log("trying to save");
      ref.child('participants').child(vm.participant.uid).child('isActive').set(false);
    }
    
    function savedSuccessfully(){
      foundationApi.publish('main-notifications', { title: 'Saved Successfully', content:  vm.participant.lName, autoclose: '3000' });
    }

  }
})();
