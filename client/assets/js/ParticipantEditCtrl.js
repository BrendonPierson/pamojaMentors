(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantEditCtrl', ParticipantEditCtrl);

  ParticipantEditCtrl.$inject = ["FBREF", "$stateParams", "$firebaseObject", "FoundationApi"];

  function ParticipantEditCtrl(FBREF, $stateParams, $firebaseObject, foundationApi) {
    var vm = this;

    console.log($stateParams.id);

    var ref = new Firebase(FBREF);

    ref.child('participants').orderByChild('uid').equalTo($stateParams.id).limitToFirst(1).on('value', function(snapshot) {
      vm.participant = snapshot.val()[0];
      console.log(vm.participant);
    });

    vm.saveParticipant = function() {
      console.log("trying to save");
      ref.child('participants').child(vm.participant.uid).set(vm.participant, savedSuccessfully);
    }
    
    function savedSuccessfully(){
      foundationApi.publish('main-notifications', { title: 'Saved Successfully', content:  vm.participant.lName, autoclose: '3000' });
    }

  }


})();
