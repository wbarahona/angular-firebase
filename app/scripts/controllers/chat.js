'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.controller:ChatController
 * @description
 * # MainController
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .controller('ChatController', function ($scope, $timeout, MessagesService) {
        // Declaring global variables for this controller
        // ------------------------------------------------------------------------
            var scope               = $scope;
            var numberOfItems       = 10;

        // Injecting into the scope var elements needed in the view
        // ------------------------------------------------------------------------
            scope.currentUser = null;
            scope.currentMessage = null;
            scope.messages = [];

            scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

        // Creating a real time listening of the firebase db API
        // ------------------------------------------------------------------------
            // Getting the title of the chat
            MessagesService.getChatTitle(function (chatTitle) {
                scope.title = chatTitle.title;
            });
            // Handling children event on messages reference from db
            MessagesService.childAdded(function (messagesChild) {
                switch(messagesChild.event) {
                    case 'child_added' :
                        scope.messages.push(messagesChild);
                        break;
                    case 'child_changed' :
                        var message = findMessageByName(messagesChild.title);
                        message.message = messagesChild.message;
                        break;
                    case 'child_removed' :
                        deleteMessageByName(messagesChild.title);
                        break;
                }
            });
            // Private function that will return us the node that was removed in the db
            function deleteMessageByName(name) {
                for (var i=0; i < scope.messages.length; i++) {
                    var currentMessage = scope.messages[i];
                    if (currentMessage.title === name) {
                        scope.messages.splice(i,1);
                        break;
                    }
                }
            }
            // Private function that will return us the node that changed in the db
            function findMessageByName(name) {
                var messageFound = null;
                for (var i=0; i < scope.messages.length; i++) {
                    var currentMessage = scope.messages[i];
                    if (currentMessage.title === name) {
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
                var promise = MessagesService.add(newMessage);
                promise.then(function () {

                });
                scope.currentMessage = null;
            };

        // A function that will stop the listening to the firebase api
        // ------------------------------------------------------------------------
            scope.turnFeedOff = function () {
                MessagesService.off();
            };

        // A function that will trigger the message list pagination to next
        // ------------------------------------------------------------------------
            scope.pageNext =  function () {
                var lastIndex = scope.messages.length - 1;
                var lastItem = scope.messages[lastIndex];

                MessagesService.pageFlip(lastItem.title, numberOfItems, 'next').then(function (messages) {
                    scope.messages = messages;
                });
            };
        // A function that will trigger the message list pagination to prev
        // ------------------------------------------------------------------------
            scope.pagePrev =  function () {
                var firstItem = scope.messages[0];

                MessagesService.pageFlip(firstItem.title, numberOfItems, 'prev').then(function (messages) {
                    scope.messages = messages;
                });
            };
     });
