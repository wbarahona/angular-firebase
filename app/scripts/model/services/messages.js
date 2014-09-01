/*global Firebase*/
'use strict';

angular.module('angularFirebaseApp')
    .service('MessagesService', function (firebaseURL, fbMessagesURL,$q, $firebase) {
        // Declaring global variables for this service
        // If we need it filtered by the first 10 elements on the database then
        // we add this '.startAt().limit(msgLimit)' to the fireMessage object
        // builder in line 14 after messagesRef variable
        // ------------------------------------------------------------------------
            var rootRef         = new Firebase(firebaseURL),
                messagesRef     = new Firebase(fbMessagesURL),
                titleRef        = rootRef.child('title'),
                fireMessage     = $firebase(messagesRef.startAt().limit(10)).$asArray(),
                allFireMessage  = $firebase(messagesRef).$asArray();

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
                        // Replace allFireMessage for fireMessage ref object to enable
                        // Pagination
                        allFireMessage.$watch(function (data) {
                            var dataVal = allFireMessage.$getRecord(data.key);
                            if (data.event === 'child_removed') {
                                dataVal = {name: '', message: ''};
                            }
                            cb.call(this, {
                                event: data.event,
                                user: dataVal.user,
                                message: dataVal.message,
                                title: data.key
                            });
                        });
                    },
                // Will add a new message to the db API
                // ------------------------------------------------------------------------
                    add: function addMessage (message) {
                        var returnName = fireMessage.$add(message);
                        return returnName;
                    },
                // Will turn off this browser listening to the API
                // ------------------------------------------------------------------------
                    off: function turnFeedOff () {
                        fireMessage.$destroy();
                    },
                // Will perform a prev n next pagination action over the list
                // ------------------------------------------------------------------------
                    pageFlip: function pageFlip (name, numberOfItems, action) {
                        var deferred = $q.defer(),
                            messages = [],
                            item = {},
                            thisItemKey = '',
                            lastItemId = 0;

                        lastItemId = allFireMessage.$indexFor(name);
                        if (0 < lastItemId && lastItemId < allFireMessage.length-1) {
                            if (action === 'prev') {lastItemId = lastItemId - (numberOfItems-1)}
                            for (var i = lastItemId;i<=lastItemId+(numberOfItems-1);i++) {
                                thisItemKey = allFireMessage.$keyAt(i);
                                if (thisItemKey) {
                                    item = allFireMessage.$getRecord(thisItemKey);
                                    item.title = item.$id;
                                    messages.push(item);
                                }
                            }
                            deferred.resolve(messages);
                        }
                        return deferred.promise;
                    }
            };
    });
