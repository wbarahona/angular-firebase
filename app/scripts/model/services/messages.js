/*global Firebase*/
'use strict';

angular.module('angularFirebaseApp')
    .service('MessagesService', function (firebaseURL) {
        // Declaring global variables for this service
        // ------------------------------------------------------------------------
            var rootRef         = new Firebase(firebaseURL);
            var messagesRef     = rootRef.child('messages');
            var titleRef        = rootRef.child('title');

        // Declaring methods for this service
        // ------------------------------------------------------------------------
            return {
                // Get the title of the window
                // ------------------------------------------------------------------------
                    getChatTitle: function chatTitle (cb) {
                        titleRef.once('value', function(snapshot) {
                            cb.call(this, {title: snapshot.val()});
                        });
                    },
                // Will work when the API responds with a change in the db
                // ------------------------------------------------------------------------
                    childAdded: function childAdded (cb) {
                        messagesRef.on('child_added', function (snapshot) {
                            var snapVal = snapshot.val();
                            cb.call(this, {
                                user: snapVal.user,
                                message: snapVal.message,
                                title: snapshot.name()
                            });
                        });
                    },
                // Will fetch which node was updated in the db
                // ------------------------------------------------------------------------
                    childUpdated: function childUpdated (cb) {
                        messagesRef.on('child_changed', function(snapshot) {
                            var snapVal = snapshot.val();
                            cb.call(this, {
                                nodeId: snapshot.name(),
                                message: snapVal.message
                            });
                        });
                    },
                // Will fetch which node was updated in the db
                // ------------------------------------------------------------------------
                    childRemoved: function childRemoved (cb) {
                        messagesRef.on('child_removed', function(snapshot) {
                            var snapVal = snapshot.val();
                            cb.call(this, {
                                nodeId: snapshot.name(),
                                message: snapVal.message
                            });
                        });
                    },
                // Will add a new message to the db API
                // ------------------------------------------------------------------------
                    add: function addMessage(message) {
                        messagesRef.push(message);
                    },
                // Will turn off this browser listening to the API
                // ------------------------------------------------------------------------
                    off: function turnFeedOff() {
                        messagesRef.off();
                    }
            };
    });
