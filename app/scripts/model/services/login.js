/*global Firebase*/
'use strict';

angular.module('angularFirebaseApp')
    .service('LoginService', function ($firebaseSimpleLogin, $q, firebaseURL) {
        // Declaring global variables for this service
            // ------------------------------------------------------------------------
                var thisService = this,
                    fbMessages          = new Firebase(firebaseURL),
                    simpleLogin         = $firebaseSimpleLogin(fbMessages),
                    user = {
                        email : '',
                        password : ''
                    },
                    response = {
                        code : 0,
                        message : '',
                        content : {}
                    };

            // Declaring methods for this service
            // ------------------------------------------------------------------------
                thisService.login = function (user) {
                    var promise = simpleLogin.$login('password', {
                            email: user.email,
                            password: user.password
                        }),
                        deferred = $q.defer();

                    promise.then(function (user) {
                        response.code = 1;
                        response.content = user;
                        //saveToken(user.firebaseAuthToken);
                        deferred.resolve(response);
                    },function (error) {
                        if(error.code === 'INVALID_PASSWORD' || error.code === 'INVALID_USER') {
                            response.message = 'Hmmm... the user or password seems to be wrong! try again!';
                        }else {
                            response.message = 'Snap, this one was on us! How embarrasing, please try again or <a href="mailto:wbarahona@live.com">report</a> this error.';
                        }
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                };

                thisService.logout = function () {
                    var promise = simpleLogin.$logout();
                    response.code = 1;
                    response.message = 'User logged out succesfully!';
                    return response;
                };

                thisService.isLoggedIn = function () {
                    return (localStorage.getItem('firebaseSession')) ? true : false;
                };

                // Private method that stores the auth_token sent by firebase for
                // the current user, note that if this token is not found in local
                // storage and the user request the chat window will be redirected
                // to login page for proper login.
                // ------------------------------------------------------------------------
                    // function saveToken (token) {
                    //     localStorage.setItem('authToken', token);
                    // };
    });
