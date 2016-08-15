function fakeHttpPromise(value) {
  return {
    then: function(callback) {return callback({data: value});},
    success: function(callback) {return callback(value);}
  }
}

beforeEach(module('ui.router'));
beforeEach(module('nibs.product'));
var Product;
beforeEach(
  inject(function($injector){
    Product = $injector.get('Product');
  })
);

describe('ProductListCtrl', function(){


  describe('doRefresh()', function(){
    it('should call Product.all() and put the result in the scope', inject(function($controller){
      var scope = {$broadcast: sinon.spy()};

      var products = [{id: "1"}];
      var products2 = [{id: "2"}];


      var stub = sinon.stub(Product, "all");
      stub.onFirstCall().returns(fakeHttpPromise(products));
      stub.onSecondCall().returns(fakeHttpPromise(products2));


      var myController = $controller('ProductListCtrl', {
        $scope: scope,
        Product: Product
      });



      scope.doRefresh();
      stub.calledTwice.should.be.true;
      scope.products.should.eql(products2);
      scope.$broadcast.calledOnce.should.be.true;
      stub.calledBefore(scope.$broadcast);
      scope.$broadcast.firstCall.args[0].should.equal('scroll.refreshComplete');
    }));
  });

  describe('the controller', function(){

    it('should call Product.all() and put the result in the scope', inject(function($controller){
      var scope = {};

      var products = [{id: "1"}, {id: "2"}];
      var stub = sinon.stub(Product, "all");
      stub.returns(
        {
          success: function(callback) {return callback(products);},
          then: function(callback) {return callback(products);}
        }
      );



      var myController = $controller('ProductListCtrl', {
        $scope: scope,
        Product: Product
      });


      scope.products.should.eql(products);
      stub.calledOnce.should.be.true;
    }));
  });
});


describe('Product', function() {


  describe('all', function () {
    it('should return all the products obtained by an http request', inject(function( $rootScope, $httpBackend) {
      Product.should.exist;
      var products = [{id: "1"}, {id: "2"}];
      $rootScope.server = {url: ''};
      $httpBackend.when('GET', '/products').respond(products);

      var result;
      Product.all().success(function (x) {
        result = x;
      });

      $httpBackend.flush();

      result.should.eql(products);


    } ));
  });

  describe('get', function () {
    it('should return the product with the right id obtained by an http request', inject(function( $rootScope, $httpBackend) {
      Product.should.exist;
      var product = {id: "1"};
      $rootScope.server = {url: ''};
      $httpBackend.when('GET', '/products/1').respond(product);

      var result;
      Product.get(1).success(function (x) {
        result = x;
      });

      $httpBackend.flush();

      result.should.eql(product);


    } ));
  });


}
);
