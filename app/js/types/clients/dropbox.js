'use strict';

angular.module('types')
    .factory('DropboxClient', function($http, $q, $timeout, Item, $location){
        var app_key = "qfd1sjynxut1kkw",
            dropbox,
            userInfoPromise;

        /**
         * Child items cached by parent item's id.
         * @type {object}
         */
        var cache = {};

        // dropbox popup auth driver bug workaround
        // open the auth popup, close it, open again - and do login - you'll get two callback fired
        var loginDeferred;
        var loginCallback;

        function DropboxCtor() {
            dropbox = new Dropbox.Client({ key: app_key });
            // todo: localhost?
            var url = $location.protocol() + '://' + $location.host() + '/dropbox_oauth.html';
            dropbox.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: url}));
            this.user = {};
        }

        DropboxCtor.prototype = {
            /**
             * Instantiates the Item based on data received from drive api.
             * @param data Raw data object received from drive.files.list method.
             * @returns {Item}
             */
            _getItem: function(entry) {
                var type = entry.isFolder ? 'dir' : 'file';
                var item = new Item(this, entry.path, entry.name, type);

                item.shared = false;
                var self = this;

                if (item.type === 'file') {
                    item.url = function () {
                        return self._getFileUrl(entry.path);
                    };
                }

//                if (!item.shared) {
//                    item.parentid = data.parents && data.parents[0].id;
//                }

                return item;
            },

            login: function(immediate) {
                var self = this;

                loginDeferred = $q.defer();

                if (!loginCallback) {
                    loginCallback = function (error, client) {
                        if (client.isAuthenticated()) {
                            loginDeferred.resolve();
                        }
                        else {
                            loginDeferred.reject(error);
                        }
                    };
                }

                dropbox.authenticate({interactive: !immediate}, function(error, client) {
                    if (loginCallback) {
                        loginCallback(error, client);
                        loginCallback = undefined;
                    }
                });

                return loginDeferred.promise
                    .then(function() {
                        return self._getUserInfo();
                    });
            },

            logout: function() {
                var deferred = $q.defer();

                cache = {};

                dropbox.signOut(function() {
                    deferred.resolve();
                });

                return deferred.promise;
            },

            _getUserInfo: function() {
                if (!userInfoPromise) {
                    var deferred = $q.defer(),
                        self = this;

                    dropbox.getAccountInfo(function(error, userInfo) {
                        if (error) {
                            deferred.reject(error);
                        }
                        else {
                            self.user.name = userInfo.name;
                            self.user.email = userInfo.email;
                            self.user.quota = userInfo.quota;
                            self.user.used = userInfo.usedQuota;
                            deferred.resolve();
                        }
                    });

                    userInfoPromise = deferred.promise;
                }

                return userInfoPromise;
            },

            /** // todo: update comment
             * Loads child Items from drive by parent id (if not cached) and caches them internally to reuse further.
             * @param {string} [path = ''] parent item id.
             * @returns {Promise<Item[]>}
             */
            getItemsByParent: function(path) {
                if (!cache[path]) {

                    if (!path) {
                        path = '';
                    }

                    var self = this,
                        deferred = $q.defer();

                    dropbox.readdir(path, function(error, entries, stat, entry_stats) {
                        if (error) {
                            deferred.reject(error);
                        }

                        var items = entry_stats.map(function(entry) {
                            return self._getItem(entry);
                        });

                        items.sort(Item.sort);

                        deferred.resolve(items);
                    });

                    cache[path] = deferred.promise;
                }

                return cache[path];
            },

            _getFileUrl: function(path) {
//                return url + '?getfile=' + encodeURIComponent(path);
                var deferred = $q.defer();

                dropbox.makeUrl(path, {download: true}, function(error, shareUrl) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        deferred.resolve(shareUrl.url);
                    }
                });

                return deferred.promise;
            },

            isLoggedIn: function() {
                return dropbox.isAuthenticated();
            }
        };

        return DropboxCtor;
    });