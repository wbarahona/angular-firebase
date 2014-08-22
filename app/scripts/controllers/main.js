'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseApp.controller:MainController
 * @description
 * # MainController
 * Controller of the angularFirebaseApp
 */
angular.module('angularFirebaseApp')
    .controller('MainController', function ($scope, $timeout, MessagesService) {
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
                //$timeout(function () {
                    scope.title = chatTitle.title;
                //});
            });
            // New element was added to the db
            MessagesService.childAdded(numberOfItems, function (addedChild) {
                $timeout(function () {
                    scope.messages.push(addedChild);
                });
            });
            // a element on the db was updated
            MessagesService.childUpdated(function (childUpdated) {
                $timeout(function () {
                    var message = findMessageByName(childUpdated.nodeId);
                    message.message = childUpdated.message;
                });
            });
            // a element on the db was removed
            MessagesService.childRemoved(function (childRemoved) {
                $timeout(function () {
                    deleteMessageByName(childRemoved.nodeId);
                });
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
                MessagesService.add(newMessage);
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

                MessagesService.pageNext(lastItem.name, numberOfItems).then(function (messages) {
                    scope.messages = messages;
                });
            };
        // A function that will trigger the message list pagination to prev
        // ------------------------------------------------------------------------
            scope.pagePrev =  function () {
                var firstItem = scope.messages[0];

                MessagesService.pagePrev(firstItem.name, numberOfItems).then(function (messages) {
                    scope.messages = messages;
                });
            };
     });
