angular.module('nibs.settings', ['openfb', 'nibs.activity', 'ionic'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/settings.html",
                        controller: "SettingsCtrl"
                    }
                }
            })

    })

    .controller('SettingsCtrl', function ($scope, $rootScope, $window, $ionicPopup, $document, $state, $http, OpenFB, Activity, Picture) {
        $scope.isAndroid = ionic.Platform.isAndroid();
        $scope.deleteActivities = function() {
            Activity.deleteAll().success(function() {
                $rootScope.user.status = 1;
                $ionicPopup.alert({title: 'Nibs', content: 'Activities deleted'});
            });
        };

        $scope.deletePictures = function() {
            Picture.deleteAll().success(function() {
                $ionicPopup.alert({title: 'Nibs', content: 'Pictures deleted'});
            });
        };

        $scope.logout = function() {
            $rootScope.user = null;
            $window.localStorage.removeItem('user');
            $window.localStorage.removeItem('token');
            $state.go('app.welcome');
        };

        $scope.logoutAndRevoke = function() {
            if (OpenFB.isLoggedIn())  {
                OpenFB.logout();
                $rootScope.user = null;
                $window.localStorage.removeItem('user');
                $window.localStorage.removeItem('token');
                $state.go('app.welcome');
            } else {
                $ionicPopup.alert({title: 'Error', content: 'You need to be logged in with a Facebook user to use this option.'});
            }
        };

        $scope.resetNofications = function() {
          $http.get($rootScope.server.url + '/notifications/reset/' + $window.localStorage.getItem('notifToken')).success(function() {
            $window.localStorage.setItem('seqNumber', '0');
          }).then(function() {
            $ionicPopup.alert({title: 'Nibs', content: 'Notifications reset'});
          });

        }

    });
