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
    .state('gallery', {
      url: "/gallery",
      templateUrl: "templates/gallery.html",
      controller: 'GalleryCtrl',
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
