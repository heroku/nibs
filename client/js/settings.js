angular.module('nibs.settings', ['openfb', 'nibs.activity'])

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

    .controller('SettingsCtrl', function ($scope, $rootScope, $window, $ionicPopup, $document, $state, OpenFB, Activity, Picture) {

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

    });