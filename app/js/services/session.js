'use strict';

angular.module('services')
    .factory('session', function($q, Player, Playlist, Tree, page, helper, storage, clients, TreeNode, Item) {
        var that = {
            active: false, // indicates whether the session has started and all it's components are initialized
            userInfo: undefined
        };

        var autoLoginPromise;

        function start() {
            that.playlist = new Playlist();
            that.tree = new Tree();

            clients.get(true).forEach(function(client) {
                var root = new TreeNode(new Item(client, '', client.title, 'root'));

                root.getChildren();
                root.collapsed = false; // expand roots on start

                that.tree.roots.push(root);
            });

            that.player = new Player();

            that.active = true;

            checkState();
        }

        function end() {
            that.active = false;

            that.player.stop();
            that.player = undefined;
            that.tree = undefined;
            that.playlist = undefined;
            page.setTitle('Music Queue');

            // do not try to auto relogin on implicit logout
            var d = $q.defer();
            d.reject();
            autoLoginPromise = d.promise;
        }

        /**
         * Parses the "state" query parameter passed by Google Drive on "Open with..." and plays the specified files.
         */
        function checkState() {
            var st = getParameterByName('state');

//        st = "%7B%22ids%22%3A%5B%220B9OzzXRNwUnXVnRxU2kzQTdsUm8%22%2C%220B9OzzXRNwUnXdEpyOVJNUkxwcDg%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22103354693083460731603%22%7D";

            if (st) {
                var state = angular.fromJson(decodeURI(st));

//            // debug
//            state = {
//                "ids": [
//                    "0B9OzzXRNwUnXVnRxU2kzQTdsUm8",
//                    "0B9OzzXRNwUnXdEpyOVJNUkxwcDg"
//                ],
//                "action": "open",
//                "userId": "103354693083460731603"
//            };

                if (state.ids && state.ids.length > 0) {
                    that.playlist.set(helper.getRecordsByItemIds(state.ids))
                        .then(function(records) {
                            if (records.length > 0) {
                                that.player.playRecord(records[0]);
                            }
                        })
                        .catch(function(reason) {
                        });
                }
            }
        }

        /** todo: update comment
         * Lunches the dataService authorization in and starts the session on success.
         * @param {boolean} auto If set to "true" will try to sign in quietly by using cookies.
         * @returns {Promise<session>} A promise of started session.
         */
        that.login = function (serviceName) {
            return clients.load(serviceName)
                .then(function(client) {
                    return client.login();
                })
                .then(function() {
                    start();
                });
        };

        /**
         * Try to login using all services found in storage
         * @returns {*}
         */
        that.autoLogin = function () {
            if (!autoLoginPromise) {
                var services = ['drive', 'dropbox'];

                var promises = [];

                services.forEach(function(serviceName) {
                    promises.push(
                        clients.load(serviceName)
                            .then(function(client) {
                                return client.login(true);
                            })
                    );
                });

                autoLoginPromise = $q.one(promises)
                    .then(function(results) {
                        start();
                    });
            }

            return autoLoginPromise;
        };

        /**
         * Logs out and stops the session.
         * @returns {Promise} A promise resolved when done.
         */
        that.logout = function (serviceName) {
            var promise;

            if (serviceName) {
                promise = clients[serviceName].logout();
            }
            else {
                var promises = [];

                clients.get(true).forEach(function (client) {
                    promises.push(client.logout());
                });

                promise = $q.allSettled(promises);
            }

            return promise
                .then(function () {
                    end();
                });
        };

        that.isLoggedIn = function() {
            return clients.get(true).length > 0;
        };

        return that;
    });