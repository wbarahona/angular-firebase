'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.controller:NavigationController
 * @description
 * # NavigationController
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .controller('NavigationController', function($scope,$location,LoginService) {
        // Declaring global variables for this controller
        // ------------------------------------------------------------------------
            var scope = $scope;

            scope.isLoggedIn = LoginService.isLoggedIn;

            scope.isActive = function (path) {
                var currentPath         =   $location.path().split('/')[1];
                return currentPath      === path.split('/')[1];
            };
    });
