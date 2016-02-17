'use strict';

describe('Service: weblinking', function () {

  // load the service's module
  beforeEach(module('webuiApp'));

  // instantiate service
  var weblinking;
  beforeEach(inject(function (_weblinking_) {
    weblinking = _weblinking_;
  }));

  it('should do something', function () {
    expect(!!weblinking).toBe(true);
  });

});
