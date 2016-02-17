'use strict';

/**
 * @ngdoc function
 * @name webuiApp.controller:MeCtrl
 * @description
 * # MeCtrl
 * Controller of the webuiApp
 */
angular.module('webuiApp')
  .controller('MeCtrl', function($scope, Session, $http, $location) {
    if (!Session.currentUser()) {
      $location.url('/');
    }

    $scope.remoteFollowings = [];
    $http.get('http://' + Session.currentUserServer() + '/api/' + Session.currentUser() + '/followings.json').then(function(resp) {
      for (var i = 0; i < resp.data.followings.length; i++) {
        if (resp.data.followings[i].user.indexOf('@') != -1) {
          $scope.remoteFollowings.push(resp.data.followings[i].user);
        }
      }
    })

    var freshTweets = function() {
      $http.get('http://' + Session.currentUserServer() + '/api/' + Session.currentUser() + '/tweets.json').then(function(resp) {
        $scope.myTweets = resp.data.tweets;
      })
    };

    $scope.get = function(href) {
      $http.get(href, {
        authenticated: true
      }).then(function(resp) {
        $scope.tweets = resp.data.tweets;
        $scope.pagination = resp.links;
      })
    }

    $scope.tweet = null;
    $scope.postTweet = function() {
      $http.post('http://' + Session.currentUserServer() + '/api/' + Session.currentUser() + '/tweets.json', {
        content: $scope.tweet
      }, {
        authenticated: true
      }).then(function() {
        $scope.tweet = null;
        freshTweets();
      })
    }
    freshTweets();
    $scope.get('http://' + Session.currentUserServer() + '/api/' + Session.currentUser() + '/reading_list.json');
  });
