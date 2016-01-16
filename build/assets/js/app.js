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

(function() {
  'use strict';

  angular.module('application')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

  function config($urlProvider, $locationProvider, $stateProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "templates/home.html",
      controller: 'HomeCtrl',
      controllerAs: 'vm'
    })
    .state('mission', {
      url: "/mission",
      templateUrl: "templates/mission.html"
    })
    .state('donate', {
      url: "/donate",
      templateUrl: "templates/donate.html",
      controller: 'DonateCtrl',
      controllerAs: 'vm'
    })
    .state('programs', {
      url: "/programs",
      templateUrl: "templates/programs.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl',
      controllerAs: 'vm'
    })
    .state('participants', {
      url: "/participants",
      templateUrl: "templates/participants.html",
      controller: 'ParticipantsCtrl',
      controllerAs: 'vm'
    })
    .state('participant', {
      url: "/participant/:id",
      templateUrl: "templates/participant.html",
      controller: 'ParticipantCtrl',
      controllerAs: 'vm'
    })
    .state('thankYou', {
      url: "/thankyou?id&amount",
      templateUrl: "templates/thankYou.html",
      controller: 'ThankYouCtrl',
      controllerAs: 'vm'
    })
    .state('participantEdit', {
      url: "/participantEdit/:id",
      templateUrl: "templates/participantEdit.html",
      controller: 'ParticipantEditCtrl',
      controllerAs: 'vm',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireAuth();
        }]
      }
    })
    .state('admin', {
      url: "/admin",
      templateUrl: "templates/admin.html",
      controller: 'AdminCtrl',
      controllerAs: 'vm',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireAuth();
        }]
      }
    })
    .state('about', {
      url: "/about",
      templateUrl: "templates/about.html"
    });
  }

})();


(function(){
  'use strict';
  
  var ref = "https://pamoja.firebaseio.com/";

  angular
    .module("application")
    .constant('FBREF', ref);

})();
(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantsCtrl', ParticipantsCtrl);

  ParticipantsCtrl.$inject = ["FBREF", "$firebaseArray"];

  function ParticipantsCtrl(FBREF, $firebaseArray) {
    var vm = this;
    var ref = new Firebase(FBREF);

    vm.participants = $firebaseArray(ref.child('participants').orderByChild('isActive').equalTo(true));
    
  }

})();

(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantCtrl', ParticipantCtrl);

  ParticipantCtrl.$inject = ["$http", "FBREF", "$stateParams", "FoundationApi"];

  function ParticipantCtrl($http, FBREF, $stateParams, foundationApi) {
    var vm = this;

    var ref = new Firebase(FBREF);

    $http.get(FBREF + "/participants/" + $stateParams.id + '/.json').then(success, failure);

    function success (response) {
      vm.participant = response.data;
    }

    function failure (err) {
      console.log(err);
    }

    vm.goToPaypal = function() {
      foundationApi.publish('main-notifications', { title: 'Redirecting', content:  'You will be taken to paypal to complete the donation.', autoclose: '3000' });
    }

  }
})();

(function() {
  'use strict';

  angular.module('application')
    .controller('ParticipantEditCtrl', ParticipantEditCtrl);

  ParticipantEditCtrl.$inject = ["FBREF", "$http", "$stateParams", "$firebaseObject", "FoundationApi"];

  function ParticipantEditCtrl(FBREF, $http, $stateParams, $firebaseObject, foundationApi) {
    var vm = this;

    var ref = new Firebase(FBREF);

    $http.get(FBREF + "/participants/" + $stateParams.id + '/.json').then(success, failure);

    function success (response) {
      vm.participant = response.data;
    }

    function failure (err) {
      console.log(err);
    }

    vm.saveParticipant = function() {
      ref.child('participants').child(vm.participant.uid).set(vm.participant, savedSuccessfully);
    }
    
    function savedSuccessfully(){
      foundationApi.publish('main-notifications', { title: 'Saved Successfully', content:  "Participant: " + vm.participant.fName + " " + vm.participant.lName, autoclose: '3000', color: 'success' });
    }

  }
})();

(function() {
  'use strict';

  angular.module('application')
    .controller('HomeCtrl', HomeCtrl);


  function HomeCtrl() {
    var vm = this;
    
    $(".animation-text").typed({
      strings: ["WE WILL GROW.","WE HAVE HOPE.", "WE CAN LEAD.", "WE ARE TOGETHER.", "PAMOJA"],
      startDelay: 500,
      backDelay: 500,
      showCursor: true,
      cursorChar: " |",
      typeSpeed: 100,
      callback: animationCallback
    });
  }

  function animationCallback() {
    $(".white-text").slideUp(500, function() {
      $("#homeDonateButton").slideDown(500);
    });
  }

})();

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
    
    vm.saveNewParticipant = function() {
      vm.newParticipant.dateAdded = Date.now();
      vm.newParticipant.isActive = true
      var newPartRef = ref.child('participants').push(vm.newParticipant, addedSuccessfully(ref));
      ref.child('participants').child(newPartRef.key()).child('uid').set(newPartRef.key());
    }

    function addedSuccessfully(ref){
      foundationApi.publish('main-notifications', { title: 'Added Successfully', content:  vm.newParticipant.lName, autoclose: '3000', color: 'success'  });
      foundationApi.publish('basicModal', 'close');
    }

  }
})();

(function() {
  'use strict';

  angular.module('application')
    .controller('DonateCtrl', DonateCtrl);

  DonateCtrl.$inject = ["FoundationApi", "FBREF", "$firebaseObject"];

  function DonateCtrl(foundationApi, FBREF, $firebaseObject) {
    var vm = this;

    var ref = new Firebase(FBREF);

    vm.donations = $firebaseObject(ref.child('totalDonations'));

    vm.goToPaypal = function() {
      foundationApi.publish('main-notifications', { title: 'Redirecting', content:  'You will be taken to paypal to complete the donation.', autoclose: '3000' });
    }

  }
})();

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

(function() {
  'use strict';

  angular.module('application')
    .controller('ThankYouCtrl', ThankYouCtrl);

  ThankYouCtrl.$inject = ["FBREF", "$http", "$stateParams", "FoundationApi"];

  function ThankYouCtrl(FBREF, $http, $stateParams, foundationApi) {
    var vm = this;
    vm.amount = $stateParams.amount;

    var ref = new Firebase(FBREF);

    $http.get(FBREF + 'participants/' + $stateParams.id + '.json').then(function(response) {
      vm.participant = response.data;
      foundationApi.publish('main-notifications', { title: 'Success!', autoclose: '3000', color: "success" });
    }, function(err) {
      console.log(err);
    });
  }
})();



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