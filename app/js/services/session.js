'use strict';

angular.module('services')
    .factory('session', function($q, Player, Playlist, Tree, page, helper, storage, clients, TreeNode, Item) {
        var that = {
            active: false,
            isLoggedIn: false,
            userInfo: undefined,
            activeServices: []
        };

        var autoLoginPromise;

        function start() {
            that.playlist = new Playlist();
            that.tree = new Tree();

            clients.get(true).forEach(function(client) {
                that.tree.roots.push(new TreeNode(new Item(client, '', client.name, true)));
            });

            that.player = new Player();

            that.active = true;
//            that.userInfo = dataService.userInfo;

            checkState();
        }

        function end() {
            that.player.stop();
            that.player = undefined;
            that.tree = undefined;
            that.playlist = undefined;
            page.setTitle('Music Queue');
            that.active = false;

            // do not try to auto relogin on implicit logout
            var d = $q.defer();
            d.reject();
            autoLoginPromise = d.promise;
        }

        function getLoginPromise(auto) {
            return dataService.authorize(auto)
                .then(function () {
                    start();
                    return that;
                });
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

        /**
         * Lunches the dataService authorization in and starts the session on success.
         * @param {boolean} auto If set to "true" will try to sign in quietly by using cookies.
         * @returns {Promise<session>} A promise of started session.
         */
        that.login = function (auto) {
            var promise;

            if (!auto) {
                promise = getLoginPromise();
            }
            else {
                if (!autoLoginPromise) {
                    autoLoginPromise = getLoginPromise(true);
                }

                promise = autoLoginPromise;
            }

            return promise;
        };

        /**
         * Try to login using all service found in storage
         * @returns {*}
         */
        that.autoLogin = function () {
            var services = ['drive'];

            var promises = [];

            services.forEach(function(serviceName) {
                var promise = clients.load(serviceName)
                    .then(function(client) {
                        return client.login(true);
                    });

                promises.push(promise);
            });

            return $q.allSettled(promises).then(function(results) {
                start();
            });
        };

        /**
         * Logs out and stops the session.
         * @returns {Promise} A promise resolved when done.
         */
//        that.logout = function (serviceName) {
//            var promise;
//
//            if (serviceName) {
//                promise = dataServices[serviceName].logout();
//            }
//            else {
//                var promises = [];
//                that.activeServices.forEach(function (service) {
//                    promises.push(service.logout())
//                        .finally(function() {
//                            delete that.activeServices[serviceN]
//                        });
//                });
//                promise = $q.allSettled(promises).then(function() {
//                    that.activeServices = [];
//                });
//            }
//
//            return promise.then(function() {
//                if ()
//                    });
//
//                that.activeServices.
//                    return dataService.signOut()
//                    .then(function () {
//                        end();
//                    });
//            };

            that.isLoggedIn = function() {
                return clients.get(true).length > 0;
            };

            return that;
        });