



describe('ScanCtrl', function() {
  var cancelledImage = {cancelled: true, format: 'QR_CODE'};
  var couponInfo = {id: 1};
  var okImage = {cancelled: false, format: 'QR_CODE', text: JSON.stringify(couponInfo)};



  beforeEach(module('ui.router'));
  beforeEach(module('nibs.scan'));
  beforeEach(function(){ navigator.camera = true });

  describe("takePicture()", function() {
    var ionicPopup, cordovaBarcodeScanner, Coupon, cordovaToast;
    beforeEach(
      inject(function(_$ionicPopup_, _$cordovaBarcodeScanner_, _Coupon_, _$cordovaToast_){
        ionicPopup = _$ionicPopup_;
        cordovaBarcodeScanner = _$cordovaBarcodeScanner_;
        Coupon = _Coupon_;
        cordovaToast = _$cordovaToast_;
      })
    );


    it("should warn when there's no camera", inject(function($controller) {
      var scope = {};

      Coupon.should.exist;
      ionicPopup.should.exist;

      navigator.camera = undefined;

      var spy1 = sinon.spy(Coupon, "check");
      var spy2 = sinon.spy(ionicPopup, "alert");


      var spy3 = sinon.spy(cordovaBarcodeScanner, "scan");



      var myController = $controller('ScanCtrl', {
        $scope: scope,
        $ionicPopup: ionicPopup,
        $cordovaBarcodeScanner: cordovaBarcodeScanner,
        Coupon: Coupon,
        $cordovaToast: cordovaToast,

      });

      scope.takePicture();
      spy1.called.should.be.false;
      spy2.called.should.be.true;
      spy2.firstCall.args[0].content.should.eql("This device does not support Camera");
      spy3.called.should.be.false;
    }));


    it("shouldn't do anything when the scan's cancelled", inject(function($controller) {
      var scope = {};

      Coupon.should.exist;
      ionicPopup.should.exist;

      var spy1 = sinon.spy(Coupon, "check");
      var spy2 = sinon.spy(ionicPopup, "alert");


      sinon.stub(cordovaBarcodeScanner, "scan").returns(fakePromise(cancelledImage));



      var myController = $controller('ScanCtrl', {
        $scope: scope,
        $ionicPopup: ionicPopup,
        $cordovaBarcodeScanner: cordovaBarcodeScanner,
        Coupon: Coupon,
        $cordovaToast: cordovaToast,

      });

      scope.takePicture();
      spy1.called.should.be.false;
      spy2.called.should.be.false;
    }));


    it("should parse the image data and check the coupon, then confirm and consume it", inject(function($controller) {
      var scope = {};

      Coupon.should.exist;
      ionicPopup.should.exist;

      var spy2 = sinon.spy(ionicPopup, "alert");

      var couponStub = sinon.stub(Coupon, "check");
      couponStub.returns(fakePromise({data: {valid: true, name: "name", description: "desc"} } ) );

      var couponStub2 = sinon.stub(Coupon, "consume");
      couponStub2.returns(fakePromise({ } ));

      var confirmStub = sinon.stub(ionicPopup, "confirm");
      confirmStub.returns(fakePromise(true));

      sinon.stub(cordovaBarcodeScanner, "scan").returns(fakePromise(okImage));

      var toastStub = sinon.stub(cordovaToast, "showLongCenter");

      var myController = $controller('ScanCtrl', {
        $scope: scope,
        $ionicPopup: ionicPopup,
        $cordovaBarcodeScanner: cordovaBarcodeScanner,
        Coupon: Coupon,
        $cordovaToast: cordovaToast,

      });

      scope.takePicture();
      couponStub.calledOnce.should.be.true;
      couponStub.firstCall.args[0].should.eql(couponInfo);
      spy2.called.should.be.false;
      couponStub.calledBefore(confirmStub).should.be.true;
      confirmStub.calledOnce.should.be.true;
      confirmStub.firstCall.args[0].should.eql({subTitle: "name", template: "desc", title: "Valid coupon"});
      confirmStub.calledBefore(couponStub2).should.be.true;
      couponStub2.calledOnce.should.be.true;
      couponStub2.firstCall.args[0].should.eql(couponInfo);
      couponStub2.calledBefore(toastStub).should.be.true;
      toastStub.calledOnce.should.be.true;
      toastStub.firstCall.args[0].should.eql('Coupon consumed');
    }));

  });

});
