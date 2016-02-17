'use strict';

/**
 * @ngdoc service
 * @name webuiApp.server
 * @description
 * # server
 * Service in the webuiApp.
 */
angular.module('webuiApp')
  .service('Server', function(primaryServer, $location) {
    var forcedServer = null;
    var setCurrentServer = function(srv) {
      forcedServer = srv;
    }
    var urlServer = function() {
      var srv = $location.url().match(/@([\w\.:]+)/)
      if (srv) {
        return srv[1];
      }
    }
    var currentServer = function() {
      if (forcedServer) {
        return forcedServer;
      }
      var url = urlServer();
      if (url) {
        return url;
      }
      return primaryServer;
    };
    var server = {
      currentServer: currentServer,
      setCurrentServer: setCurrentServer,
      urlServer: urlServer
    }

    return server;
  });
