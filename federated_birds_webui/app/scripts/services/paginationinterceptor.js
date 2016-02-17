'use strict';

/**
 * @ngdoc service
 * @name webuiApp.paginationinterceptor
 * @description
 * # paginationinterceptor
 * Service in the webuiApp.
 */
angular.module('webuiApp')
  .service('PaginationInterceptor', function(weblinking) {
    return {
      'response': function(config) {
        var linksH = config.headers('link');
        if (linksH) {
          config.links = {};
          var c = weblinking.parseHeader(linksH)
          for(var i=0;i<c.linkvalue.length;i++){
            config.links[c.linkvalue[i].rel] = c.linkvalue[i].href
          }
        }
        return config;
      }
    }
  });
