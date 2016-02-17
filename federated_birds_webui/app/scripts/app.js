'use strict';

/**
 * @ngdoc overview
 * @name webuiApp
 * @description
 * # webuiApp
 *
 * Main module of the application.
 */
angular
  .module('webuiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/@:server', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SignInCtrl'
      })
      .when('/signout', {
        templateUrl: 'views/signin.html',
        controller: 'SignOutCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignUpCtrl'
      })
      .when('/me', {
        templateUrl: 'views/me.html',
        controller: 'MeCtrl'
      })
      .when('/:user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $httpProvider.interceptors.push([
      '$injector',
      function($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
    $httpProvider.interceptors.push([
      '$injector',
      function($injector) {
        return $injector.get('PaginationInterceptor');
      }
    ]);
  }).run(function($rootScope, Session, Server) {
    $rootScope.currentUser = Session.currentUser;
    $rootScope.currentServer = Server.currentServer;
  });
