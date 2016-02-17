'use strict';

/**
 * @ngdoc function
 * @name webuiApp.controller:UserctrlCtrl
 * @description
 * # UserctrlCtrl
 * Controller of the webuiApp
 */
angular.module('webuiApp')
  .controller('UserCtrl', function($scope, Session, $routeParams, $http, Server) {
    $scope.user = $routeParams.user.split('@', 2)[0]
    $scope.currentUser = Session.currentUser
    var distantSrv = (Server.urlServer() || Server.currentServer());

    $scope.get = function(href) {
      $http.get(href).then(function(resp) {
        $scope.tweets = resp.data.tweets;
        $scope.pagination = resp.links;
      })
    }
    $scope.get('http://' + distantSrv + '/api/' + $scope.user + '/tweets.json');

    if (Session.currentUser()) {
      $http.get('http://' + Session.currentUserServer() + '/api/' + Session.currentUser() + '/followings.json?per_page=200').then(function(resp) {
        for (var i = 0; i < resp.data.followings.length; i++) {
          if (resp.data.followings[i].user == $scope.user) {
            $scope.found = true;
            return
          }
        }
        $scope.found = false;
      })

      var payload = {
        handle: $scope.user
      };
      if (Session.currentUserServer() != distantSrv) {
        payload['server'] = distantSrv;
      }
      $scope.follow = function() {
        $http.post('http://' + Session.currentUserServer() + '/api/' + Session.currentUser() + '/followings.json', payload, {
          authenticated: true
        }).then(function(resp) {
          $scope.found = true;
        })
      }

      $scope.unfollow = function() {
        $http.delete('http://' + Session.currentUserServer() + '/api/' + Session.currentUser() + '/followings.json', {
          data: payload,
          headers: {
            'Content-Type': 'application/json'
          },
          authenticated: true
        }).then(function(resp) {
          $scope.found = false;
        })
      }
    }
  });
