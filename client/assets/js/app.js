(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',
    
    "firebase"
  ])
    .run(run);

  run.$inject = ["$rootScope", "$state"];

  function run($rootScope, $state) {
    FastClick.attach(document.body);
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
      $state.go("home");
        }
    });
  }

})();
