/*global Firebase*/
'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.controller:RegisterController
 * @description
 * # MainController
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .controller('RegisterController', function ($scope, $firebaseSimpleLogin, firebaseURL) {
        // Declaring global variables for this controller
        // ------------------------------------------------------------------------
            var scope               = $scope,
                fbMessages          = new Firebase(firebaseURL);

            scope.errorsFound       = false;
            scope.errors            = [];
            scope.simpleLogin       = $firebaseSimpleLogin(fbMessages);

        // Declaring view listeners
        // ------------------------------------------------------------------------
            scope.registerUser = {
                email: '',
                password: '',
                confirmPassword: ''
            };

        // Declaring method that will insert a new user into firebase
        // using simple login build
        // ------------------------------------------------------------------------

            scope.register          =  function () {
                var promise     = scope.simpleLogin.$createUser(scope.registerForm.email.$viewValue,scope.registerForm.password.$viewValue),
                    userObj     = scope.registerForm;

                if (userObj.password.$viewValue !== userObj.confirmPassword.$viewValue) {
                    scope.errors.push('Passwords does not match!');
                }else {
                    scope.errors        = [];
                    scope.errorsFound   = false;
                }
                if (scope.errors.length > 0) {
                    scope.errorsFound = true;
                    return;
                }
                promise.then(function (user) {
                    console.log(user);
                }, function (error) {
                    console.log(error);
                });
            };
     });
