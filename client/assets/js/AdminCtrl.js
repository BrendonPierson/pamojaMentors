(function() {
  'use strict';

  angular.module('application')
    .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ["FBREF", "$http", "$stateParams", "FoundationApi"];

  function AdminCtrl(FBREF, $http, $stateParams, foundationApi) {
    var vm = this;

    console.log("admin");
    
    var ref = new Firebase(FBREF);

    $http.get(FBREF + 'participants.json').then(function(response) {
      console.log(response.data);
      vm.participants = response.data;
    }, function(err) {
      console.log(err);
    });
    
    vm.saveNewParticipant = function() {
      vm.newParticipant.dateAdded = Date.now();
      vm.newParticipant.isActive = true
      var newPartRef = ref.child('participants').push(vm.newParticipant, addedSuccessfully(ref));
      ref.child('participants').child(newPartRef.key()).child('uid').set(newPartRef.key());
    }

    function addedSuccessfully(ref){
      console.log(ref);
      foundationApi.publish('main-notifications', { title: 'Added Successfully', content:  vm.newParticipant.lName, autoclose: '3000', color: 'success'  });
      foundationApi.publish('basicModal', 'close');
    }

  }
})();
