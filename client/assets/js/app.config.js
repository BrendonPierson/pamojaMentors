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
      templateUrl: "templates/home.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "templates/about.html",
      controller: 'AboutCtrl',
      controllerAs: 'vm'
    });
  }

})();
