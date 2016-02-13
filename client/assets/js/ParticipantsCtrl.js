(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantsCtrl', ParticipantsCtrl);

  ParticipantsCtrl.$inject = ["FBREF", "$firebaseArray"];

  function ParticipantsCtrl(FBREF, $firebaseArray) {
    var vm = this;
    var ref = new Firebase(FBREF);

    var participants = $firebaseArray(ref.child('participants').orderByChild('isActive').equalTo(true));
    participants.$loaded().then(function(participants){
      vm.participants = _.sortBy(participants, function(participant) { 
        return participant.moneyRaised * -1
      })
    })
  }

})();
