angular.module('nibs.report', ['nibs.coupon'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.report', {
                url: "/report",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/report.html",
                        controller: "ReportCtrl"
                    }
                }
            })

    })

    // Services

     //Controllers
    .controller('ReportCtrl', function ($scope, $rootScope, Coupon) {
      function refresh() {
        return Coupon.getReport().then(function(report) {
          $scope.total = report.data.total;
          $scope.offers = report.data.offers;
        });
      }

      refresh();

      $scope.doRefresh = function() {
  			refresh();
  		};

    });
