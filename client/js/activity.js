angular.module('nibs.activity', [])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.activity', {
                url: "/activity",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/activity-list.html",
                        controller: "ActivityCtrl"
                    }
                }
            })

    })

    // Services
    .factory('Activity', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/activities');
            },
            create: function(activity) {
                return $http.post($rootScope.server.url + '/activities/', activity);
            },
            deleteAll: function() {
                return $http.delete($rootScope.server.url + '/activities');
            }
        };
    })

    //Controllers
    .controller('ActivityCtrl', function ($scope, $state, Activity) {
        Activity.all().success(function(activities) {
            $scope.activities = activities
        });

        $scope.doRefresh = function() {
            Activity.all().success(function(activities) {
                $scope.activities = activities;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.popupDialog = function() {

            if (navigator.notification) {
                navigator.notification.alert(
                    'You have a new message!',  // message
                    function() {                // callback
                        $state.go('app.messages');
                    },
                    'Nibs',                     // title
                    'Open Inbox'             // buttonName
                );
            } else {
                alert('You have a new message!');
                $state.go('app.messages');
            }

        };

    });