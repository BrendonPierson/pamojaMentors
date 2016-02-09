(function() {
  'use strict';

  angular.module('application')
    .controller('GalleryCtrl', GalleryCtrl);

  GalleryCtrl.$inject = ["FBREF", "$firebaseArray"];

  function GalleryCtrl(FBREF, $firebaseArray) {
    var vm = this;

    var ref = new Firebase(FBREF);
    var currentIndex = 0;

    var photos = $firebaseArray(ref.child('photos'));
    photos.$loaded().then(function(){
      setPhoto(photos[currentIndex]);
    });
    

    function getNextImage(previousIndex) {
      console.log("previous ind", previousIndex);
      if(photos[previousIndex + 1]) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      return photos[currentIndex];
    }

    function getPrevImage(previousIndex) {
      if(previousIndex === 0) {
        currentIndex = photos.length;
      } else {
        currentIndex = previousIndex--;
      }
      return photos[currentIndex];
    }

    function setPhoto(photo) {
      console.log("photo", photo);
      $("#image-frame").css('background-image', 'url(' + photo.imageUrl + ')');
      $("#image-frame").addClass("photo");
      // $("#image-frame").html("<h1>" + photo.title + "</h1>" + '<div ng-click="vm.prev()" class="grid-block gallery-controls float-left"></div><div ng-click="vm.prev()" class="grid-block gallery-controls float-right"></div>');
    }
    
    vm.next = function() {
      setPhoto(getNextImage(currentIndex));
    };
    vm.prev = function() {
      setPhoto(getPrevImage(currentIndex));
    };

  }
})();
