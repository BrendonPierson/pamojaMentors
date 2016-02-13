(function() {
  'use strict';

  angular.module('application')
    .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ["FBREF", "$http", "$stateParams", "FoundationApi"];

  function AdminCtrl(FBREF, $http, $stateParams, foundationApi) {
    var vm = this;
    
    var ref = new Firebase(FBREF);

    $http.get(FBREF + 'participants.json').then(function(response) {
      vm.participants = response.data;
    }, function(err) {
      console.log(err);
    });

    $http.get(FBREF + 'totalDonations.json').then(function(response) {
      vm.totalDonations = response.data;
    }, function (err) {
      console.log("err", err)
    })
    
    vm.saveNewParticipant = function() {
      vm.newParticipant.dateAdded = Date.now();
      vm.newParticipant.moneyRaised = 0;
      vm.newParticipant.goal = parseInt(vm.newParticipant.goal);
      var newPartRef = ref.child('participants').push(vm.newParticipant, addedSuccessfully(ref));
      ref.child('participants').child(newPartRef.key()).child('uid').set(newPartRef.key(), function() {vm.newParticipant = {}});
    }

    vm.saveTotalDonations = function() {
      ref.child('totalDonations').set(vm.totalDonations, updatedTotalDonationsSuccessfully())
    }

    function updatedTotalDonationsSuccessfully() {
      foundationApi.publish('main-notifications', { title: 'Successfully Updated', content:  "The total is now at $" + vm.totalDonations['2016'], autoclose: '3000', color: 'success'  });
    }

    function addedSuccessfully(ref){
      foundationApi.publish('basicModal', 'close');
    }

  }
})();
