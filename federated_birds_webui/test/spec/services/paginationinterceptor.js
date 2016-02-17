'use strict';

describe('Service: paginationinterceptor', function () {

  // load the service's module
  beforeEach(module('webuiApp'));

  // instantiate service
  var paginationinterceptor;
  beforeEach(inject(function (_paginationinterceptor_) {
    paginationinterceptor = _paginationinterceptor_;
  }));

  it('should do something', function () {
    expect(!!paginationinterceptor).toBe(true);
  });

});
