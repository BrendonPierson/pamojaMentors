(function() {
  'use strict';

  angular.module('application')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ["FBREF", "$http", "$stateParams", "$firebaseArray", "FoundationApi", "$state", "$timeout"];

  function LoginCtrl(FBREF, $http, $stateParams, $firebaseArray, foundationApi, $state, $timeout) {
    var vm = this;
    
    var ref = new Firebase(FBREF);
    vm.auth = ref.getAuth();

    var users = $firebaseArray(ref.child('users'));

    vm.logOut = function() {
      ref.unauth();
      foundationApi.publish('main-notifications', { title: 'Logged out', color: "warning", autoclose: '1000', position:"top-left" });
      $timeout(function(){
        $state.go('home')
      }, 1000);
    }

    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        vm.auth = true;
        if(_.find(users,'uid',authData.uid)) {
          foundationApi.publish('main-notifications', { title: 'Welcome Back', content:  authData.google.displayName, color: "success", autoclose: '3000' });
        } else {
          ref.child('users').child(authData.uid).set(authData, function(err) {
            if(err) {
              consol.log(err);
            } else {
              foundationApi.publish('main-notifications', { title: 'successfully added', content:  authData.google.displayName, color: "success", autoclose: '3000' });
            }
          });
        }
      }
    });

  }
})();
