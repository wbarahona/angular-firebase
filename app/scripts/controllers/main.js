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
    .controller('MainController', function ($scope, $timeout) {
        // Declaring global variables for this controller
        // ------------------------------------------------------------------------
            var scope               = $scope;
            // Firebase API for this app
            var rootRef             = new Firebase('https://vivid-heat-1154.firebaseio.com/');
            var messagesRef         = rootRef.child('messages');
            var titleRef            = rootRef.child('title');

        // Injecting into the scope var elements needed in the view
        // ------------------------------------------------------------------------
            scope.currentUser = null;
            scope.currentMessage = null;
            scope.messages = [];
            scope.title = null;

            scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

        // Creating a real time listening of the firebase db API
        // ------------------------------------------------------------------------
            // Getting the title of the chat
            titleRef.once('value', function(snapshot) {
                scope.title = snapshot.val();
                //titleRef.off();
            });
            // New element was added to the db
            messagesRef.on('child_added', function(snapshot) {
                $timeout(function () {
                    var snapshotVal = snapshot.val();
                    scope.messages.push({
                        message: snapshotVal.message,
                        user: snapshotVal.user,
                        name: snapshot.name()
                    });
                });
            });
            // a element on the db was updated
            messagesRef.on('child_changed', function(snapshot) {
                $timeout(function () {
                    var snapshotVal = snapshot.val();
                    var message = findMessageByName(snapshot.name());
                    message.message = snapshotVal.message;
                });
            });
            // a element on the db was removed
            messagesRef.on('child_removed', function(snapshot) {
                $timeout(function () {
                    var snapshotVal = snapshot.val();
                    var message = deleteMessageByName(snapshot.name());
                    message.message = snapshotVal.message;
                });
            });
            // Function that will return us the node that was removed in the db
            function deleteMessageByName(name) {
                for (var i=0; i < scope.messages.length; i++) {
                    var currentMessage = scope.messages[i];
                    if (currentMessage.name === name) {
                        scope.messages.splice(i,1);
                        break;
                    }
                }
            }
            // Function that will return us the node that changed in the db
            function findMessageByName(name) {
                var messageFound = null;
                for (var i=0; i < scope.messages.length; i++) {
                    var currentMessage = scope.messages[i];
                    if (currentMessage.name === name) {
                        messageFound = currentMessage;
                        break;
                    }
                }
                return messageFound;
            }

        // Declaring a method that sends the user message and user name into the
        // firebase db API
        // ------------------------------------------------------------------------
            scope.sendMessage = function () {
                // lets set the new message
                var newMessage = {
                    user: scope.currentUser,
                    message: scope.currentMessage
                };
                // push it man
                messagesRef.push(newMessage);
                scope.currentMessage = null;
            };

        // Function that will stop the listening to the firebase api
        // ------------------------------------------------------------------------
            scope.turnFeedOff = function () {
                messagesRef.off();
            };
     });
