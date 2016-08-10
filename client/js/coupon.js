angular.module('nibs.coupon', [])

// Routes


// Services
.factory('Coupon', function ($http, $rootScope) {
  return {
    create: function(coupon) {
      return $http.post($rootScope.server.url + '/coupons/', coupon);
    },
    get: function(couponId) {
      return $http.get($rootScope.server.url + '/coupons/' + couponId);
    },
    check: function(couponInfo) {
      return $http.post($rootScope.server.url + '/coupons/check/', couponInfo);
    },
    consume: function(coupon) {
      return $http.post($rootScope.server.url + '/coupons/consume/', couponInfo);
    }
  };
});
