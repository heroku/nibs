var app = angular.module('nibs', ['ionic', 'openfb', 'nibs.config', 'nibs.profile', 'nibs.auth', 'nibs.product', 'nibs.offer', 'nibs.store-locator', 'nibs.gallery', 'nibs.settings', 'nibs.case'])

    .run(function ($window, $location, $rootScope, $state, $ionicPlatform, $http, OpenFB, FB_APP_ID) {

        var user = JSON.parse($window.localStorage.getItem('user'));

        $rootScope.user = user;
        $rootScope.server = {url: $window.localStorage.getItem('serverURL') || "http://nibs2.herokuapp.com"};

        // Intialize OpenFB Facebook library
        OpenFB.init(FB_APP_ID, $window.localStorage);

        $ionicPlatform.ready(function() {
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }

        });

        // Re-route to welcome street if we don't have an authenticated token
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== 'app.login' && toState.name !== 'app.signup' && toState.name !== 'app.welcome' && toState.name !== 'app.logout' && !$window.localStorage.getItem('token')) {
                console.log('Aborting state ' + toState.name + ': No token');
                $location.path('/app/welcome');
                event.preventDefault();
            }
        });

        $state.go('app.profile');
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl"
            })

            .state('app.welcome', {
                url: "/welcome",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/welcome.html"
                    }
                }
            })


        // if none of the above states are matched, use this as the fallback
//        $urlRouterProvider.otherwise('/app/profile');

    })


    .controller('AppCtrl', function ($scope, $rootScope, $state, $window, $location, $ionicViewService, $ionicPopup, $ionicModal) {

        $ionicModal.fromTemplateUrl('templates/survey.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openSurveyDialog = function(survey) {
            $scope.questions = [{question: survey.q1_text, choices:survey.q1_choices.split(',')},
                                {question: survey.q2_text, choices:survey.q2_choices.split(',')}];
            $scope.modal.show();
        };

        $rootScope.openSurveyDialog = $scope.openSurveyDialog;
        $scope.$on('modal.hidden', function(event) {

        });


    })

    // XMLHTTPRequest Interceptor.
    // Outbound: Adds access token to HTTP requests before they are sent to the server.
    // Inbound: Handles 401 (Not Authorized) errors by loading the Login page
    .factory('AuthInterceptor', function ($rootScope, $window, $q, $location) {

        return {
            request: function (config) {
                $rootScope.loading = true;
                config.headers = config.headers || {};
                if ($window.localStorage.getItem('token')) {
                    config.headers.authorization = $window.localStorage.getItem('token');
                }
                return config || $q.when(config);
            },
            requestError: function (request) {
                console.log('request error');
                $rootScope.loading = false;
                return $q.reject(request);
            },
            response: function (response) {
                $rootScope.loading = false;
                return response || $q.when(response);
            },
            responseError: function (response) {
                console.log(JSON.stringify(response));
                $rootScope.loading = false;
                if (response && response.status === 401) {
                    // TODO: broadcast event instead.
                    $location.path('/app/welcome');
                } else if (response && response.status !== 404) {
                    console.log(response);
                    // alert(response.data);
                }
                return $q.reject(response);
            }
        };
    })

    // Add the AuthInterceptor declared above
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });
