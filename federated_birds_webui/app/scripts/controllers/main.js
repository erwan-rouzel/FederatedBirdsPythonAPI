'use strict';

/**
 * @ngdoc function
 * @name webuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webuiApp
 */
angular.module('webuiApp')
  .controller('MainCtrl', function($scope, $http, Server) {
    $scope.get = function(addr) {
      $http.get(addr).then(function(resp) {
        $scope.tweets = resp.data.tweets;
        $scope.pagination = resp.links
      }, function() {
        $scope.error = "Unable to communicate with server: " + Server.currentServer();
      })
    }
    $scope.get('http://' + Server.currentServer() + '/api/tweets.json');
  });
