'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.controller:RegisterController
 * @description
 * # MainController
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .controller('RegisterController', function ($scope, RegisterService, $location) {
        // Declaring global variables for this controller
        // ------------------------------------------------------------------------
            var scope               = $scope;

            scope.errors            = {
                exist : false,
                message : ''
            };

        // Declaring view listeners
        // ------------------------------------------------------------------------
            scope.registerUser      = {
                email: '',
                password: '',
                confirmPassword: ''
            };

        // Declaring method that will insert a new user into firebase
        // using simple login build
        // ------------------------------------------------------------------------

            scope.register          =  function () {
                scope.registerUser         = {
                    email : scope.registerForm.email.$viewValue,
                    password : scope.registerForm.password.$viewValue,
                    repassword : scope.registerForm.confirmPassword.$viewValue
                };

                if (scope.registerUser.password !== scope.registerUser.repassword) {
                    scope.errors.exist = true;
                    scope.errors.message = 'Passwords does not match!';
                }else {
                    scope.errors.exist = false;
                    scope.errors.message = '';
                }
                if (scope.errors.message.length > 0) {
                    scope.errors.exist = true;
                } else {
                    RegisterService.registerUser(scope.registerUser).then(function (response) {
                        if (response.code === 0) {
                            scope.errors.exist = true;
                            scope.errors.message = response.message;
                        } else {
                            $location.path('/login');
                        }
                    },function (error) {
                        console.log(error);
                    });
                }

            };
     });
