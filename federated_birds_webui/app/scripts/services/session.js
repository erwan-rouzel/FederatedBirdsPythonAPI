'use strict';

/**
 * @ngdoc service
 * @name webuiApp.Session
 * @description
 * # Session
 * Service in the webuiApp.
 */
angular.module('webuiApp')
  .service('Session', function(Server) {
    var session = {}
    session.create = function(data) {
      session.userData = data
      session.srv = Server.currentServer();
    };
    session.destroy = function() {
      session.userData = {};
    };
    session.currentUserToken = function() {
      if (!session.userData) {
        return null;
      }
      return session.userData.token
    }
    session.currentUser = function() {
      if (!session.userData) {
        return null;
      }
      return session.userData.handle
    }

    session.currentUserServer = function() {
      return session.srv;
    }
    return session;
  });
