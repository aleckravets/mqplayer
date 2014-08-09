'use strict';

angular.module('types')
    .factory('DropboxClient', function($http, $q, $timeout, Item){
        var app_key = "qfd1sjynxut1kkw",
            dropbox,
            authorized,
            token,
            userInfoPromise;

        /**
         * Child items cached by parent item's id.
         * @type {object}
         */
        var cache = {};

        function DropboxCtor() {
            dropbox = new Dropbox.Client({ key: app_key });
//            dropbox.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));
            dropbox.reset();
            this.name = 'dropbox';
            this.title = 'Dropbox';
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

                if (item.type === 'file') {
                    item.url = function () {
                        return this._getFileUrl(entry.path);
                    };
                }

//                if (!item.shared) {
//                    item.parentid = data.parents && data.parents[0].id;
//                }

                return item;
            },

            login: function(immediate) {
                var deferred = $q.defer(),
                    self = this;

                dropbox.authenticate({interactive: !immediate}, function(error, client) {
                    if (client.isAuthenticated()) {
                        // Cached credentials are available, make Dropbox API calls.
                        // todo: get user info
                        authorized = true;
                        self.user.name = 'user';
                        deferred.resolve();
                    }
                    else {
                        deferred.reject(error);
                    }
                });

                return deferred.promise;
            },

            logout: function() {
//                // reset cache
//                cache = {};
//
//                var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + token.access_token + "&callback=JSON_CALLBACK";
//
//                // always rejected because the the callback is called without arguments
//                // whereas $http expects something to be returned
//                // that's why we suppress the rejection and call finally
//                return $http.jsonp(url)
//                    .catch(function() {})
//                    .finally(function() {
//                        authorized = false;
//                    });
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

                    var deferred = $q.defer();

                    dropbox.readdir(path, function(error, entries, stat, entry_stats) {
                        if (error) {
                            deferred.reject(error);
                        }

                        var items = entry_stats.map(function(entry) {
                            return self._getItem(entry);
                        });

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
                return authorized;
            }
        };

        return DropboxCtor;
    });