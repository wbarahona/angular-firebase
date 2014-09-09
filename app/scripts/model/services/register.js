/*global Firebase*/
'use strict';

angular.module('angularFirebaseApp')
    .service('RegisterService', function ($firebaseSimpleLogin, $q, firebaseURL) {
        // Declaring global variables for this service
            // ------------------------------------------------------------------------
                var thisService = this,
                    fbMessages          = new Firebase(firebaseURL),
                    simpleLogin         = $firebaseSimpleLogin(fbMessages),
                    user = {
                        email : '',
                        password : '',
                        repassword : ''
                    },
                    response = {
                        code : 0,
                        message : '',
                        content : {}
                    };

            // Declaring methods for this service
            // ------------------------------------------------------------------------
                thisService.registerUser = function (userData) {

                    var promise = simpleLogin.$createUser(userData.email,userData.password),
                        deferred = $q.defer();

                    promise.then(function (response) {
                        response.code = 1;
                        response.content = response;
                        deferred.resolve(response);
                    },function (error) {
                        if(error.code === 'EMAIL_TAKEN') {
                            response.message = 'Hmmm... this username seems to be already taken! try again!';
                        }else {
                            response.message = 'Snap, this one was on us! How embarrasing, please try again or <a href="mailto:wbarahona@live.com">report</a> this error.';
                        }
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                };
    });
