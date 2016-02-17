'use strict';

/**
 * @ngdoc function
 * @name webuiApp.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the webuiApp
 */
angular.module('webuiApp')
  .controller('SignInCtrl', function($scope, Session, $http, $location, Server) {
    $scope.credentials = {
      username: null,
      password: null
    }
    $scope.error = false;

    $scope.hosterize = function() {
      if ($scope.credentials.username && $scope.credentials.username.indexOf('@') == -1) {
        $scope.credentials.username += '@' + Server.currentServer();
      }
    }

    $scope.signin = function() {
      var usrSrv = $scope.credentials.username.split('@', 2);
      $scope.error = false;
      $http.post('http://' + usrSrv[1] + '/api/sessions.json', {
        handle: usrSrv[0],
        password: $scope.credentials.password
      }).then(function(req) {
        Server.setCurrentServer(usrSrv[1]);
        Session.create(req.data);
        $location.url('/me')
      }, function() {
        $scope.error = true;
      });
    }
  });
