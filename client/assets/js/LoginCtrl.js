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
          users.$add(authData).then(function(ref) {
            var id = ref.key();
            console.log("added record with id " + id);
            users.$indexFor(id); // returns location in the array
            foundationApi.publish('main-notifications', { title: 'successfully added', content:  authData.google.displayName, autoclose: '3000' });
          });
        }
      }
    });

  }
})();
