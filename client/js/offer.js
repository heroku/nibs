angular.module('nibs.offer', ['openfb', 'nibs.status', 'nibs.activity', 'nibs.coupon', 'nibs.wallet'])

	// Routes
	.config(function ($stateProvider) {

		$stateProvider

			.state('app.offers', {
				url: "/offers",
				views: {
					'menuContent' : {
						templateUrl: "templates/offer-list.html",
						controller: "OfferListCtrl"
					}
				}
			})

			.state('app.offer-detail', {
				url: "/offers/:offerId",
				views: {
					'menuContent' : {
						templateUrl: "templates/offer-detail.html",
						controller: "OfferDetailCtrl"
					}
				}
			})

			.state('app.offer-redeem', {
				url: "/offers/:offerId/redeem/:couponId",
				views: {
					'menuContent' : {
						templateUrl: "templates/redeem.html",
						controller: "OfferRedeemCtrl"
					}
				}
			})

	})

	// Services
	.factory('Offer', function ($http, $rootScope) {
		return {
			all: function() {
				return $http.get($rootScope.server.url + '/offers');
			},
			get: function(offerId) {
				return $http.get($rootScope.server.url + '/offers/' + offerId);
			}
		};
	})

	//Controllers
	.controller('OfferListCtrl', function ($scope, Offer) {
		Offer.all().success(function(offers) {
			$scope.offers = offers;
		});

		$scope.doRefresh = function() {
			Offer.all().success(function(offers) {
				console.log("refresh") 
				$scope.offers = offers;
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	})

	.controller('OfferDetailCtrl', function ($rootScope, $scope, $state, $ionicPopup, $stateParams, $q, Offer, OpenFB, WalletItem, Activity, Status, Coupon) {

		Offer.get($stateParams.offerId).success(function(offer) {
			$scope.offer = offer;
		});

		$scope.shareOnFacebook = function (offer) {
  //    Uncomment to enable actual "Share on Facebook" feature
			OpenFB.post('/me/feed', {name: offer.name, link: offer.campaignPage, picture: offer.image, caption: 'Offer ends soon!', description: offer.description})
				.success(function() {
					Status.show('Shared on Facebook!');
					var activity = new Activity({type: "Shared on Facebook", points: 1000, offerId: $scope.offer.sfid, name: $scope.offer.name, image: $scope.offer.image});
					activity.$save(Status.checkStatus);
				})
				.error(function() {
					$ionicPopup.alert({title: 'Facebook', content: 'Something went wrong while sharing this offer.'});
				});
			Status.show('Shared on Facebook!');
			Activity.create({type: "Shared on Facebook", points: 1000, offerId: $scope.offer.sfid, name: $scope.offer.name, image: $scope.offer.image})
				.success(function(status) {
					Status.checkStatus(status);
				});

		};

		$scope.shareOnTwitter = function () {
			Status.show('Shared on Twitter!');
			Activity.create({type: "Shared on Twitter", points: 1000, offerId: $scope.offer.sfid, name: $scope.offer.name, image: $scope.offer.image})
				.success(function(status) {
					Status.checkStatus(status);
				});
		};

		$scope.shareOnGoogle = function () {
			Status.show('Shared on Google+!');
			Activity.create({type: "Shared on Google+", points: 1000, offerId: $scope.offer.sfid, name: $scope.offer.name, image: $scope.offer.image})
				.success(function(status) {
					Status.checkStatus(status);
				});
		};

		$scope.saveToWallet = function () {
			WalletItem.create({offerId: $scope.offer.id}).success(function(status) {
				Status.show('Saved to your wallet!');
				Activity.create({type: "Saved to Wallet", points: 1000, offerId: $scope.offer.sfid, name: $scope.offer.name, image: $scope.offer.image})
					.success(function(status) {
						Status.checkStatus(status);
					});
			});
		};

		$scope.redeem = function () {
			Coupon.create({offerId: $scope.offer.sfid}).success(function(coupon) {
				$scope.coupon = coupon;
				console.log("Coupon: " + JSON.stringify($scope.coupon));
				function createActivity() {
					// Ajouts de points :
					return Activity.create({type: "Redeemed Offer", points: 1000, offerId: $scope.offer.sfid, name: $scope.offer.name, image: $scope.offer.image})
					.success(function(status) {
						Status.checkStatus(status);
					});
				}

				return $q.when(	(coupon.date == null ) ?createActivity()				: undefined );

			}).then(function() {
				$state.go('app.offer-redeem', {offerId: $scope.offer.sfid, couponId: $scope.coupon.id});
			});


		};

	})

	.controller('OfferRedeemCtrl', function ($rootScope, $scope, $state, $ionicPopup, $stateParams, Offer, Coupon) {

		Coupon.get($stateParams.couponId).success(function(coupon) {
			$scope.coupon = coupon;

		});

		Offer.get($stateParams.offerId).success(function(offer) {
			$scope.offer = offer;
		});
	})


;
