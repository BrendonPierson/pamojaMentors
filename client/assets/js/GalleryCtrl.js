(function() {
  'use strict';

  angular.module('application')
    .controller('GalleryCtrl', GalleryCtrl);

  GalleryCtrl.$inject = ["FBREF", "$firebaseArray"];

  function GalleryCtrl(FBREF, $firebaseArray) {
    var vm = this;

    var ref = new Firebase(FBREF);
    //
    // var photos = $firebaseArray(ref.child('photos'));
    // photos.$loaded().then(function() {
    //   vm.photos = photos.map(function(photo) {
    //     photo.link
    //   })
    //   console.log("pho//   })/tos", photos)
    // });http://localhost:80assets/images/photoGallery/IMG_0129.jpg
    vm.photos = [
      {link: "assets/images/photoGallery/IMG_0178.jpg", thumb: "assets/images/photoGallery/IMG_0178.jpg"},
      {link: "assets/images/photoGallery/IMG_0129.jpg", thumb: "assets/images/photoGallery/IMG_0129.jpg"},
      {link: "assets/images/photoGallery/IMG_0172.jpg", thumb: "assets/images/photoGallery/IMG_0172.jpg"},
      {link: "assets/images/photoGallery/IMG_0256.jpg", thumb: "assets/images/photoGallery/IMG_0256.jpg"},
      {link: "assets/images/photoGallery/IMG_0276.jpg", thumb: "assets/images/photoGallery/IMG_0276.jpg"},
      {link: "assets/images/photoGallery/IMG_0416.jpg", thumb: "assets/images/photoGallery/IMG_0416.jpg"},
      {link: "assets/images/photoGallery/IMG_0490.jpg", thumb: "assets/images/photoGallery/IMG_0490.jpg"},
      {link: "assets/images/photoGallery/IMG_0504.jpg", thumb: "assets/images/photoGallery/IMG_0504.jpg"},
      {link: "assets/images/photoGallery/IMG_2341.jpg", thumb: "assets/images/photoGallery/IMG_2341.jpg"},
      {link: "assets/images/photoGallery/IMG_2343.jpg", thumb: "assets/images/photoGallery/IMG_2343.jpg"},
      {link: "assets/images/photoGallery/IMG_8565.jpg", thumb: "assets/images/photoGallery/IMG_8565.jpg"},
      {link: "assets/images/photoGallery/IMG_8657.jpg", thumb: "assets/images/photoGallery/IMG_8657.jpg"},
      {link: "assets/images/photoGallery/IMG_8712.jpg", thumb: "assets/images/photoGallery/IMG_8712.jpg"},
      {link: "assets/images/photoGallery/IMG_9151.jpg", thumb: "assets/images/photoGallery/IMG_9151.jpg"},
      {link: "assets/images/photoGallery/IMG_9247.jpg", thumb: "assets/images/photoGallery/IMG_9247.jpg"},
      {link: "assets/images/photoGallery/IMG_9249.jpg", thumb: "assets/images/photoGallery/IMG_9249.jpg"},
      {link: "assets/images/photoGallery/IMG_9526.jpg", thumb: "assets/images/photoGallery/IMG_9526.jpg"},
      {link: "assets/images/photoGallery/IMG_9595.jpg", thumb: "assets/images/photoGallery/IMG_9595.jpg"},
      {link: "assets/images/photoGallery/IMG_9892.jpg", thumb: "assets/images/photoGallery/IMG_9892.jpg"},
      {link: "assets/images/photoGallery/IMG_9997.jpg", thumb: "assets/images/photoGallery/IMG_9997.jpg"}
    ]

    vm.focusImg = function(imageUrl) {
      $("#focusImg").css( 'background-image', 'url(' + imageUrl + ')' );
    }


  }
})();
