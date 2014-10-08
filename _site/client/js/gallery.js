angular.module('nibs.gallery', ['nibs.s3uploader'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.gallery', {
                url: "/gallery",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/gallery.html",
                        controller: "GalleryCtrl"
                    }
                }
            })

    })

    // Services
    .factory('Picture', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/pictures');
            },
            create: function(picture) {
                return $http.post($rootScope.server.url + '/pictures', picture);
            },
            deleteAll: function(pictureId) {
                return $http.delete($rootScope.server.url + '/pictures');
            }
        };
    })

    //Controllers
    .controller('GalleryCtrl', function ($scope, $rootScope, $ionicPopup, Picture, S3Uploader) {

        Picture.all().success(function(pictures) {
            $scope.pictures = pictures;
        });

        $scope.takePicture = function (from) {

            if (!navigator.camera) {
                $ionicPopup.alert({title: 'Sorry', content: "This device does not support Camera"});
                return;
            }

            var fileName,
                options = {   quality: 45,
                    allowEdit: true,
                    targetWidth: 300,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG };
            if (from === "LIBRARY") {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                options.saveToPhotoAlbum = false;
            } else {
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.saveToPhotoAlbum = true;
            }

            navigator.camera.getPicture(
                function (imageURI) {
                    // without setTimeout(), the code below seems to be executed twice.
                    setTimeout(function () {
                        fileName = new Date().getTime() + ".jpg";
                        S3Uploader.upload(imageURI, fileName).then(function () {
                            var p = {url: 'https://s3-us-west-1.amazonaws.com/sfdc-demo/' + fileName};
                            Picture.create(p);
                            $scope.pictures.push(p);
                        });
                    });
                },
                function (message) {
                    // We typically get here because the use canceled the photo operation. Seems better to fail silently.
                }, options);
            return false;
        };

    });