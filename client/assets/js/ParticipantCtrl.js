(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantCtrl', ParticipantCtrl);

  ParticipantCtrl.$inject = ["FBREF", "$stateParams", "FoundationApi"];

  function ParticipantCtrl(FBREF, $stateParams, foundationApi) {
    var vm = this;

    console.log($stateParams.id);

    var ref = new Firebase(FBREF);

    ref.child('participants').orderByChild('uid').equalTo($stateParams.id).limitToFirst(1).on('value', function(snapshot) {
      vm.participant = snapshot.val()[0];
      console.log(vm.participant);
    });

    vm.goToPaypal = function() {
      console.log("go to goToPaypal fired");
      foundationApi.publish('main-notifications', { title: 'Redirecting', content:  'You will be taken to paypal to complete the donation.', autoclose: '3000' });
    }

  }
})();
