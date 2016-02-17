'use strict';

/**
 * @ngdoc service
 * @name webuiApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the webuiApp.
 */
angular.module('webuiApp')
  .factory('AuthInterceptor', function(Session) {
    return {
      'request': function(config) {
        if (config.authenticated) {
          if (config.data) {
            config.data.token = Session.currentUserToken();
          } else {
            config.headers['X-Token'] = Session.currentUserToken();
          }
        }
        return config;
      }
    }
  });
