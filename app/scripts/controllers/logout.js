'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:LogoutController
 * @description
 * # LogoutController
 * Controller of the angularApp
 */
angular.module('angularFirebaseApp')
		.controller('LogoutController', function ($location, LoginService) {
			// Declaring global variables for this controller
			// ------------------------------------------------------------------------
				//var scope               = $scope;


			// Injecting into the scope var elements needed in the view
			// ------------------------------------------------------------------------


			// Declaring Methods and Private Functions for the view
			// ------------------------------------------------------------------------
				// Function that log out a user when invoked
				// ------------------------------------------------------------------------
					LoginService.logout();
					$location.path('/');
		});
