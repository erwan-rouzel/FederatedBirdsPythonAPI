'use strict';

/**
 * @ngdoc function
 * @name webuiApp.controller:SignoutCtrl
 * @description
 * # SignoutCtrl
 * Controller of the webuiApp
 */
angular.module('webuiApp')
  .controller('SignOutCtrl', function ($scope, Session, $location) {
    Session.destroy();
    $location.url('/')
  });
