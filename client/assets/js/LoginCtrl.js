(function() {
  'use strict';

  angular.module('application')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ["FBREF", "$http", "$stateParams", "$firebaseArray", "FoundationApi"];

  function LoginCtrl(FBREF, $http, $stateParams, $firebaseArray, foundationApi) {
    var vm = this;

    console.log("admin");
    
    var ref = new Firebase(FBREF);

    var users = $firebaseArray(ref.child('users'));

    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        if(_.find(users,'uid',authData.uid)) {
          foundationApi.publish('main-notifications', { title: 'Welcome Back', content:  authData.google.displayName, autoclose: '3000' });
          console.log("user exists");
        } else {
          ref.child('users').child(authData.uid).set(authData, function(err) {
            if(err) {
              consol.log(err);
            } else {
              foundationApi.publish('main-notifications', { title: 'successfully added', content:  authData.google.displayName, autoclose: '3000' });
            }
          });
        }
      }
    });

  }
})();
