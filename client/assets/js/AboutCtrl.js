(function() {
  'use strict';

  angular.module('application')
    .controller('AboutCtrl', AboutCtrl);


  function AboutCtrl() {
    var vm = this;
    vm.title = "test";
  }

})();
