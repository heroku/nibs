describe('OfferModuleCtrl', function() {
  beforeEach(module('ui.router'));
  beforeEach(module('nibs.offer'));
  var Offer;
  beforeEach(
    inject(function(_Offer_){
      Offer = _Offer_;
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
})
