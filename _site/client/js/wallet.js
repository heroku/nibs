angular.module('nibs.wallet', [])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.wallet', {
                url: "/wallet",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/wallet.html",
                        controller: "WalletCtrl"
                    }
                }
            })

    })

    // Services
    .factory('WalletItem', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/wallet');
            },
            create: function(walletItem) {
                return $http.post($rootScope.server.url + '/wallet', walletItem);
            },
            del: function(offerId) {
                return $http.delete($rootScope.server.url + '/wallet/' + offerId);
            }
        };
    })

    //Controllers
    .controller('WalletCtrl', function ($scope, WalletItem) {

        function all() {
            WalletItem.all().success(function(walletItems) {
                $scope.walletItems = walletItems;
            });
        }

        $scope.deleteItem = function(offer) {
            WalletItem.del(offer.id).success(function() {
                all();
            });
        };

        all();

    });
