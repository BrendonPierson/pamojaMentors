(function() {
  'use strict';

  angular.module('application')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ["FBREF", "$http", "$stateParams", "$firebaseArray", "FoundationApi", "$state", "$timeout"];

  function LoginCtrl(FBREF, $http, $stateParams, $firebaseArray, foundationApi, $state, $timeout) {
    var vm = this;

    console.log("admin");
    
    var ref = new Firebase(FBREF);
    vm.auth = ref.getAuth();

    var users = $firebaseArray(ref.child('users'));

    vm.logOut = function() {
      ref.unauth();
      console.log("signed out");
      foundationApi.publish('main-notifications', { title: 'Logged out', color: "warning", autoclose: '1000', position:"top-left" });
      $timeout(function(){
        $state.go('home')
      }, 1000);
    }

    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        vm.auth = true;
        if(_.find(users,'uid',authData.uid)) {
          foundationApi.publish('main-notifications', { title: 'Welcome Back', content:  authData.google.displayName, color: "success", autoclose: '3000' });
          console.log("user exists");
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
