'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.controller:LoginController
 * @description
 * # MainController
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .controller('LoginController', function ($scope, LoginService, $location) {
        // Declaring global variables for this controller
        // ------------------------------------------------------------------------
            var scope               = $scope;

        // Injecting into the scope var elements needed in the view
        // ------------------------------------------------------------------------
            //scope.simpleLogin       = $firebaseSimpleLogin(fbMessages);
            scope.user = {
                email : '',
                password : ''
            };
            scope.errors = {
                exist : false,
                message : ''
            };

        // Declaring Methods and Private Functions for the view
        // ------------------------------------------------------------------------
            // Function that sends the credentials and returns a promise from
            // firebase API and resolved here to have a proper action
            // ------------------------------------------------------------------------
                scope.login =  function () {
                    LoginService.login(scope.user).then(function (response) {
                        if (response.code === 0) {
                            scope.errors.exist = true;
                            scope.errors.message = response.message;
                        }else {
                            scope.errors.exist = false;
                            scope.errors.message = '';
                            $location.path('/chat');
                        }
                    },function (error) {
                        console.log(error);
                    });

                };
     });
