angular.module('nibs.coupon', [])

    // Routes
   

    // Services
    .factory('Coupons', function ($http, $rootScope) {
        return {
            create: function(coupon) {
                return $http.post($rootScope.server.url + '/coupons/', coupon);
            }
        };
    });