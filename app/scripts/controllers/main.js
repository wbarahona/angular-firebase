/*global Firebase*/
'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.controller:MainController
 * @description
 * # MainController
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .controller('MainController', function ($scope) {
        // Declaring global variables for this controller
        // ------------------------------------------------------------------------
            var scope = $scope;
            // Firebase API for this app
            var rootRef = new Firebase('https://vivid-heat-1154.firebaseio.com/');
            var messagesRef = rootRef.child('messages');

        // Injecting into the scope var elements needed in the view
        // ------------------------------------------------------------------------
            scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

        // Declaring  a function that pushes a hardcoded message into the
        // firebase API
        // ------------------------------------------------------------------------
            scope.setMessage = function () {
                messagesRef.set({
                    user: 'Willmer',
                    message: 'Yo! City Wok seems to be closed today according to swarm app! :('
                });
            };

        // Declaring  a function that pushes a hardcoded message into the
        // firebase API
        // ------------------------------------------------------------------------
            scope.updMessage = function () {
                messagesRef.update({
                    message: 'Hey Ana! City Wok seems to be closed today according to swarm app! :( :O'
                });
            };

            scope.delMessage = function () {
                messagesRef.remove();
            };

    });
