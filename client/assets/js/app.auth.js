(function() {
  'use strict';
  angular.module('application')
    .factory('Auth', Auth);

  Auth.$inject = ["FBREF", "$firebaseAuth"];

  function Auth(FBREF, $firebaseAuth) {
    var ref = new Firebase(FBREF);
    return $firebaseAuth(ref);
  }

})();