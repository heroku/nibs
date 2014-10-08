angular.module('nibs.wishlist', [])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.wishlist', {
                url: "/wishlist",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/wishlist.html",
                        controller: "WishListCtrl"
                    }
                }
            })

    })

    // Services
    .factory('WishListItem', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/wishlist');
            },
            create: function(wishlistItem) {
                return $http.post($rootScope.server.url + '/wishlist', wishlistItem);
            },
            del: function(productId) {
                return $http.delete($rootScope.server.url + '/wishlist/' + productId);
            }
        };
    })

    // Controllers
    .controller('WishListCtrl', function ($scope, WishListItem) {

        function all() {
            WishListItem.all().success(function(products) {
                $scope.products = products;
            });
        }

        $scope.deleteItem = function(product) {
            WishListItem.del(product.id).success(function() {
                all();
            });
        };

        all();

    });