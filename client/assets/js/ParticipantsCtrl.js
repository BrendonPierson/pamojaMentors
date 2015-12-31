(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantsCtrl', ParticipantsCtrl);

  ParticipantsCtrl.$inject = ["FBREF", "$firebaseArray"];

  function ParticipantsCtrl(FBREF, $firebaseArray) {
    var vm = this;
    var ref = new Firebase(FBREF);

    vm.participants = $firebaseArray(ref.child('participants'));
    vm.participants.$loaded().then(function() {
      console.log("fbarray", vm.participants);
    });

    
  }

})();
