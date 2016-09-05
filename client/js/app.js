var app = angular.module('nibs', ['ionic','ionic.service.core', 'ionic.service.push', 'openfb', 'nibs.config', 'nibs.profile', 'nibs.auth', 'nibs.coupon', 'nibs.product', 'nibs.offer', 'nibs.store-locator', 'nibs.gallery', 'nibs.settings', 'nibs.case', 'nibs.scan', 'nibs.report'])

    .run(function ($window, $location, $rootScope, $state, $ionicPlatform, $ionicPush, $http, OpenFB, FB_APP_ID, SERVER_URL) {

        var user = JSON.parse($window.localStorage.getItem('user'));

        $rootScope.user = user;

        $rootScope.server = {url: SERVER_URL || location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')};

        // Intialize OpenFB Facebook library
        OpenFB.init(FB_APP_ID, $window.localStorage);

        $ionicPlatform.ready(function() {
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
            if(ionic.Platform.isAndroid()) {
              $ionicPush.init({
                "debug": true,
                "android.forceShow": true,
                "onNotification": function(notification) {
                  var payload = notification.payload;
                  console.log("notification: " + JSON.stringify(notification));
                  if(typeof(Storage) !== "undefined") {
                    var localStorage = $window.localStorage;
                    if(localStorage.getItem('seqNumber') == null || payload.seqNumber > parseInt(localStorage.getItem('seqNumber'))) {
                      localStorage.setItem('seqNumber', payload.seqNumber);
                      console.log("Notif: " + notification.text);
                    }
                  }
                  $state.go('app.offer-detail', {offerId: payload.offerId});
                }
              });

              $ionicPush.register(function(token) {
                console.log("Device token:", token.token);
                var seqnumber = 0;
                if($window.localStorage !== undefined ) {
                  $window.localStorage.setItem('notifToken', token.token);

                  if($window.localStorage.getItem('seqNumber') != null) {
                    seqnumber = parseInt($window.localStorage.getItem('seqNumber'));
                    if(isNaN(seqnumber)) {
                      seqnumber = 0;
                    }
                  }
                }
                $http.get(  $rootScope.server.url + '/notifications/register/' + token.token + '/' + seqnumber);

              });
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
                templateUrl: "templates/menu.html"
            })

            .state('app.welcome', {
                url: "/welcome",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/welcome.html"
                    }
                }
            })

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
