describe('OfferModuleCtrl', function() {
  beforeEach(module('ui.router'));
  beforeEach(module('nibs.offer'));

  var Offer;
  var Coupon;
  beforeEach(
    inject(function(_Offer_){
      Offer = _Offer_;
    })
  );
  beforeEach(
    inject(function(_Coupon_){
      Coupon = _Coupon_;
    })
  );

  describe('OfferListCtrl', function() {

    describe('doRefresh()', function(){
      it('should call Offer.all() and put the result in the scope', inject(function($controller){
        var scope = {$broadcast: sinon.spy()};

        var offers = [{id: "1"}];
        var offers2 = [{id: "2"}];


        var stub = sinon.stub(Offer, "all");
        stub.onFirstCall().returns(fakeHttpPromise(offers));
        stub.onSecondCall().returns(fakeHttpPromise(offers2));


        var myController = $controller('OfferListCtrl', {
          $scope: scope,
          Offer: Offer
        });



        scope.doRefresh();
        stub.calledTwice.should.be.true;
        // scope.offers.should.eql(offers2);
        console.log("AAAAAAA " + JSON.stringify(scope.offers))
        scope.$broadcast.calledOnce.should.be.true;
        stub.calledBefore(scope.$broadcast);
        scope.$broadcast.firstCall.args[0].should.equal('scroll.refreshComplete');
      }));
    });

    describe('the controller', function(){

      it('should call Offer.all() and put the result in the scope', inject(function($controller){
        var scope = {};

        var offers = [{id: "1"}, {id: "2"}];
        var stub = sinon.stub(Offer, "all");
        stub.returns(   fakeHttpPromise(offers)  );



        var myController = $controller('OfferListCtrl', {
          $scope: scope,
          Offer: Offer
        });


        scope.offers.should.eql(offers);
        stub.calledOnce.should.be.true;
      }));
    });
  })

  describe('OfferDetailCtrl', function() {
    describe('the controller', function() {
      it('should put a certain offer (from the state params) in the scope', inject(function($controller) {
        var stub = sinon.stub(Offer, 'get');
        var offer = {id: 10}
        stub.throws();
        stub.withArgs(10).returns(fakeHttpPromise( offer) );

        var scope = {};

        var myController = $controller('OfferDetailCtrl', {
          $rootScope: {},
          $scope: scope,
          $state: {},
          $ionicPopup: {},
          $stateParams: {offerId: 10},
          $q: {},
          Offer: Offer,
          OpenFB: {},
          WalletItem: {},
          Activity: {},
          Status: {},
          Coupon: {}
        });

        stub.calledOnce.should.be.true;
        scope.offer.should.eql(offer);

      }));
    });


  })

  describe('redeem()', function() {
    it('should create a new coupon and go to the coupon page', inject(function($controller) {
      var stub = sinon.stub(Offer, 'get');
      var offer = {id: 10, sfid: 'sfid'}
      stub.throws();
      stub.withArgs(10).returns(fakeHttpPromise( offer) );

      var coupon = {id: 2, date: 'date'};
      var stubCoupon = sinon.stub(Coupon, 'create');
      stubCoupon.returns(fakeHttpPromise(coupon));

      var state = { go: sinon.spy()}

      var scope = {};

      var qStub = sinon.stub();
      qStub.returns(fakePromise({}));
      var q = {when: qStub};

      var myController = $controller('OfferDetailCtrl', {
        $rootScope: {},
        $scope: scope,
        $state: state,
        $ionicPopup: {},
        $stateParams: {offerId: 10},
        $q: q,
        Offer: Offer,
        OpenFB: {},
        WalletItem: {},
        Activity: {},
        Status: {},
        Coupon: Coupon
      });

      scope.redeem();


      stub.calledOnce.should.be.true;
      scope.offer.should.eql(offer);
      scope.coupon.should.eql(coupon);
      stubCoupon.calledOnce.should.be.true;
      
      stubCoupon.firstCall.args[0].should.eql({offerId: 'sfid'});
      stubCoupon.calledBefore(state.go).should.be.true;
      state.go.calledOnce.should.be.true;
      state.go.firstCall.args[0].should.eql('app.offer-redeem');
      state.go.firstCall.args[1].should.eql({offerId: 'sfid', couponId: 2});


    }));
  })

})
