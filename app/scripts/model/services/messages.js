/*global Firebase*/
'use strict';

angular.module('angularFirebaseApp')
    .service('MessagesService', function (firebaseURL,$q) {
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
                // Will perform a next pagination action over the list
                // ------------------------------------------------------------------------
                    getChatLength: function getChatLength (cb) {
                        messagesRef.once('value', function(snapshot) {
                            cb.call(this, {chatLength: snapshot.numChildren()});
                        });
                    },
                // Will work when the API responds with a change in the db
                // ------------------------------------------------------------------------
                    childAdded: function childAdded (msgLimit, cb) {
                        messagesRef.startAt().limit(msgLimit).on('child_added', function (snapshot) {
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
                    add: function addMessage (message) {
                        messagesRef.push(message);
                    },
                // Will turn off this browser listening to the API
                // ------------------------------------------------------------------------
                    off: function turnFeedOff () {
                        messagesRef.off();
                    },
                // Will perform a next pagination action over the list
                // ------------------------------------------------------------------------
                    pageNext: function pageNext (name, numberOfItems) {
                        var deferred = $q.defer();
                        var messages = [];

                        messagesRef.startAt(null, name).limit(numberOfItems).once('value', function (snapshot) {
                            snapshot.forEach(function (snapItem) {
                                var itemVal = snapItem.val();
                                itemVal.name = snapItem.name();
                                messages.push(itemVal);
                            });
                            deferred.resolve(messages);
                        });
                        return deferred.promise;
                    },
                // Will perform a prev pagination action over the list
                // ------------------------------------------------------------------------
                    pagePrev: function pagePrev (name, numberOfItems) {
                        var deferred = $q.defer();
                        var messages = [];

                        messagesRef.endAt(null, name).limit(numberOfItems).once('value', function (snapshot) {
                            snapshot.forEach(function (snapItem) {
                                var itemVal = snapItem.val();
                                itemVal.name = snapItem.name();
                                messages.push(itemVal);
                            });
                            deferred.resolve(messages);
                        });
                        return deferred.promise;
                    }
            };
    });
