'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.directive:navbar
 * @description
 * # navbar
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/navbar.html',
            controller: 'NavigationController'
        };
    });
