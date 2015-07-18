'use strict';

angular.module('services')
    .factory('session', function($q, Player, Playlist, Tree, page, helper, clients, TreeNode, Item, appData, api, PlaylistManager) {
        var $this = {
            // todo: make private
            active: undefined, // indicates whether the session has started and all it's components are initialized
            state: {},
            loading: false
        };

        var autoLoginPromise;

        function start() {
            $this.playlist = new Playlist();
            $this.tree = new Tree();

            $this.player = new Player();

            $this.active = true;

            $this.playlistManager = new PlaylistManager;
        }

        function getRoot(client) {
            var root = new TreeNode(new Item(client, '', client.title, 'root'));

            root.getChildren();
            root.collapsed = false; // expand roots on start

            return root;
        }

        function end() {
            $this.active = false;

            $this.player.stop();
            $this.player = undefined;
            $this.tree = undefined;
            $this.playlist = undefined;
            $this.playlistManager = undefined;

            page.setTitle();

            // do not try to auto relogin on implicit logout
            var d = $q.defer();
            d.reject();
            autoLoginPromise = d.promise;
        }

        /**
         * Parses the "state" query parameter passed by Google Drive on "Open with..." and plays the specified files.
         */
        function driveOpenWith() {
            function checkState() {
                var st = getParameterByName('state');

//        st = "%7B%22ids%22%3A%5B%220B9OzzXRNwUnXVnRxU2kzQTdsUm8%22%2C%220B9OzzXRNwUnXdEpyOVJNUkxwcDg%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22103354693083460731603%22%7D";

                if (st) {
                    var state = angular.fromJson(decodeURI(st));

//                // debug
//                state = {
//                    "ids": [
//                        "0B9OzzXRNwUnXVnRxU2kzQTdsUm8",
//                        "0B9OzzXRNwUnXdEpyOVJNUkxwcDg"
//                    ],
//                    "action": "open",
//                    "userId": "103354693083460731603"
//                };

                    if (state.ids && state.ids.length > 0) {
                        $this.playlist.set(helper.getRecordsByItemIds(clients.drive, state.ids))
                            .then(function (records) {
                                if (records.length > 0) {
                                    $this.player.playRecord(records[0]);
                                }
                            })
                            .catch(function (reason) {
                            });
                    }
                }
            }


            // check parameters passed by drive's "Open with..."
            // login to drive if necessary
            if (clients.drive.isLoggedIn()) {
                checkState();
            }
            else {
                $this.login('drive', true)
                    .then(function() {
                        checkState();
                    });
            }
        }

        /** todo: update comment
         * Lunches the dataService authorization in and starts the session on success.
         * @param {boolean} auto If set to "true" will try to sign in quietly by using cookies.
         * @returns {Promise<session>} A promise of started session.
         */
        $this.login = function (serviceName, immediate) {
            return clients.load(serviceName)
                .then(function(client) {
                    return client.login(immediate)
                        .then(function() {
                            return api.login(client.name, client.token)
                                .then(function(accountId) {
                                    client.accountId = accountId;
                                });
                        })
                        .then(function() {
                            if (!$this.active) {
                                start();
                            }
                            $this.tree.roots.push(getRoot(client));

                            appData.services.add(serviceName);
                            appData.save();
                        });
                })
                .then(function() {
                    driveOpenWith();
                });
        };

        /**
         * Try to login using all services found in storage
         * @returns {*}
         */
        $this.autoLogin = function () {
            if (!autoLoginPromise) {
                var services = appData.services;

                var promises = [];

                if (services.length > 0) {
                    services.forEach(function (serviceName) {
                        promises.push(
                            clients.load(serviceName)
                                .then(function (client) {
                                    return client.login(true)
                                        .then(function() {
                                            return api.login(client.name, client.token)
                                                .then(function(accountId) {
                                                    client.accountId = accountId;
                                                });
                                        });
                                })
                        );
                    });

                    autoLoginPromise = $q.one(promises)
                        .then(function (results) {
                            start();

                            // todo: iterate over results rather than clients.get(true)
                            clients.get(true).forEach(function (client) {
                                $this.tree.roots.push(getRoot(client));
                            });
                        })
                        .catch(function (reason) {
                            $this.active = false;
                            return $q.reject(reason);
                        });
                }
                else {
                    $this.active = false;
                    autoLoginPromise = $q.reject();
                }
            }

            return autoLoginPromise;
        };

        /** // todo: update comment
         * Logs out and stops the session.
         * @returns {Promise} A promise resolved when done.
         */
        $this.logout = function (serviceName) {
            var promise;

            if (serviceName) {
                promise =
                    clients[serviceName].logout()
                        .finally(function() {
                            appData.services.remove(serviceName);
                            appData.save();
                            // active clients left?
                            if (clients.get(true).length > 0) {
                                for (var i = 0; i < $this.tree.roots.length; i++) {
                                    if ($this.tree.roots[i].item.client === clients[serviceName]) {
                                        $this.tree.roots.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                            else {
                                end();
                            }
                        });
            }
            else {
                var promises = [];

                clients.get(true).forEach(function (client) {
                    promises.push(client.logout());
                });

                promise =
                    $q.allSettled(promises)
                        .then(function() {
                            end();
                            appData.services = [];
                            appData.save();
                        });
            }

            return promise;
        };

        $this.loggedIn = function() {
            return $this.active;
        };

        return $this;
    });