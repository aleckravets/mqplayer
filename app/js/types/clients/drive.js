'use strict';

angular.module('types')
    .factory('Drive', function($http, $q, $timeout, Item, $interval){
        var clientid = '97071318931-0pqadkdeov03b36bhthnri1n3h64eg7d.apps.googleusercontent.com',
            scopes = ['https://www.googleapis.com/auth/drive.readonly'],
            authorized,
            token,
            userInfoPromise,
            refreshToken;

        /**
         * Child items cached by parent item's id.
         * @type {object}
         */
        var cache = {};

        function Drive() {
            this.user = {};
        }

        Drive.prototype = {
            /**
             * Instantiates the Item based on data received from drive api.
             * @param data Raw data object received from drive.files.list method.
             * @returns {Item}
             */
            _getItem: function(data){
                var type = data.mimeType === 'application/vnd.google-apps.folder' ? 'dir' : 'file';
                var shared = data.sharedWithMeDate ? true : false;
                var url = type === 'file' ? data.webContentLink : undefined;
                var parentid = !shared ? data.parents && data.parents[0].id : undefined;

                return new Item(this, data.id, data.title, type, url, parentid, shared);
            },

            /**
             * Loads files from server by query and returns the promise of Items array
             * @param {string} query Search query. See https://developers.google.com/drive/web/search-parameters?hl=ru for
             * details.
             * @returns {Promise<Item[]>}
             */
            _getItems: function(query) {
                var self = this,
                    deferred = $q.defer(),
                    attempts = 0;

                var retrievePageOfFiles = function (request, result) {
                    request.execute(function (resp) {
                        if (!resp.error) {
                            if (resp.items) {
                                result = result.concat(resp.items);
                            }

                            if (resp.nextPageToken) {
                                request = gapi.client.drive.files.list({ q: query, pageToken: resp.nextPageToken });
                                retrievePageOfFiles(request, result);
                            }
                            else {
                                deferred.resolve(result);
                            }
                        }
                        else {
                            if (resp.error.code == 401 && attempts < 1) {
                                // trying to refresh token and execute the same request again
                                console.log(new Date(), 'Refreshing the token...');
                                self._refreshToken()
                                    .then(function() {
                                        retrievePageOfFiles(request, result);
                                    })
                                    .catch(function() {
                                        var error = resp.error.code + " " + resp.error.message;
                                        deferred.reject('Failed to refresh token:' + error);
                                        console.log(error);
                                    });

                                attempts++;
                            }
                            else {
                                var error = resp.error.code + " " + resp.error.message;
                                deferred.reject(error);
                                console.log(error);
                            }
                        }
                    });
                };

                var initialRequest = gapi.client.drive.files.list({ q: query });
                retrievePageOfFiles(initialRequest, []);

                return deferred.promise.then(function (rawItems) {
                    var items = rawItems.map(function (rawItem) {
                        return self._getItem(rawItem);
                    });

                    items.sort(Item.sort);

                    return items;
                });
            },

            login: function(immediate) {
                var deferred = $q.defer(),
                    self = this;

                gapi.auth.authorize({'client_id': clientid, 'scope': scopes.join(' '), 'immediate': immediate || false}, function(resp) {
                    if (resp && !resp.error) {
                        authorized = true;
                        token = gapi.auth.getToken();
                        deferred.resolve();
                    }
                    else {
                        authorized = false;
                        var error = resp && resp.error;
                        deferred.reject(error);
                    }
                });

                return deferred.promise
                    .then(function() {
                        return self._getUserInfo();
                    });
            },

            _refreshToken: function() {
                var deferred = $q.defer();

                gapi.auth.authorize({'client_id': clientid, 'scope': scopes.join(' '), 'immediate': true}, function(resp) {
                    if (!resp.error) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject(resp.error.code + " " + resp.error.message);
                    }
                });

                return deferred.promise;
            },

            logout: function() {
                // reset cache
                cache = {};

                var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + token.access_token + "&callback=JSON_CALLBACK";

                // always rejected because the the callback is called without arguments
                // whereas $http expects something to be returned
                // that's why we suppress the rejection and call finally
                return $http.jsonp(url)
                    .catch(function() {})
                    .finally(function() {
                        authorized = false;
                    });
            },

            _getUserInfo: function() {
                if (!userInfoPromise) {
                    var deferred = $q.defer(),
                        self = this;

                    gapi.client.drive.about.get().execute(function (resp) {
                        if (resp.error) {
                            deferred.reject(resp.error.code + " " + resp.error.message);
                        }
                        else {
                            self.user.name = resp.name;
                            self.user.email = resp.user.emailAddress;
                            self.user.quota = resp.quotaBytesTotal;
                            self.user.used = resp.quotaBytesUsedAggregate;
                            deferred.resolve(self.user);
                        }
                    });

                    userInfoPromise = deferred.promise;
                }

                return userInfoPromise;
            },

            /**
             * Loads child Items from drive by parent id (if not cached) and caches them internally to reuse further.
             * @param {string} [parentid = 'root'] parent item id.
             * @returns {Promise<Item[]>}
             */
            getItemsByParent: function(parentid) {
                if (!cache[parentid]) {

                    if (!parentid) {
                        parentid = 'root';
                    }

                    var query = "'" + parentid + "' in parents";

                    if (parentid === 'root') {
                        query = "(sharedWithMe or " + query + ")";
                    }

                    query = query + " and trashed = false";

                    cache[parentid] = this._getItems(query);
                }

                return cache[parentid];
            },

            /**
             * Loads the file from drive by id.
             * @param {integer} id File id.
             * @returns {Promise<Item>}
             */
            getItemById: function(id) {
                var deferred = $q.defer(),
                    self = this;

                var request = gapi.client.drive.files.get({
                    'fileId': id
                });

                request.execute(function(resp) {
                    if (resp.error) {
                        var error = resp.error.code + " " + resp.error.message;
                        deferred.reject(error);
                        console.log(error);
                    }
                    else {
                        deferred.resolve(self._getItem(resp));
                    }
                });

                return deferred.promise;
            },

            isLoggedIn: function() {
                return authorized;
            }
        };

        return Drive;
    });