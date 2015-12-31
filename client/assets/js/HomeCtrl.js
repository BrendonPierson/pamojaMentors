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
