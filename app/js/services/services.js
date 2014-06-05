'use strict';

angular.module('Services')
    .factory('DataService', function($http, $q, $timeout, Item){
        var clientid = '97071318931-0pqadkdeov03b36bhthnri1n3h64eg7d.apps.googleusercontent.com';

        var scopes = [
            'https://www.googleapis.com/auth/drive.readonly'
        ];

        return {
            authorized: undefined,
            token: null,
            userInfo: null,
            authorize: function(immediate) {
                var self = this;
                var deferred = $q.defer();

                gapi.auth.authorize({'client_id': clientid, 'scope': scopes.join(' '), 'immediate': immediate || false}, function(authResult) {
                    if (authResult && !authResult.error) {
                        gapi.client.drive.about.get().execute(function(resp) {
                            self.authorized = true;
                            self.token = gapi.auth.getToken();
                            self.userInfo = resp;
                            deferred.resolve();
//                            console.log('Current user name: ' + resp.name);
//                            console.log('Root folder ID: ' + resp.rootFolderId);
//                            console.log('Total quota (bytes): ' + resp.quotaBytesTotal);
//                            console.log('Used quota (bytes): ' + resp.quotaBytesUsed);
                        });
                    }
                    else {
                        self.authorized = false;
                        deferred.reject();
                    }
                });

                return deferred.promise;
            },
            signOut: function() {
                var deferred = $q.defer();

                var self = this;
                var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + this.token.access_token;

                // this is strange
                $http.get(url)['finally'](function() {
                    self.authorized = false;
                    deferred.resolve();
                });

                return deferred.promise;
            },
            loadItems: function(parentid) {
                var deferred = $q.defer();

                var q = "'" + parentid + "' in parents and trashed = false";

                var retrievePageOfFiles = function(request, result) {
                    request.execute(function(resp) {
                        if (resp.items) result = result.concat(resp.items);
                        var nextPageToken = resp.nextPageToken;
                        if (nextPageToken) {
                            request = gapi.client.drive.files.list({ q: q, pageToken: nextPageToken });
                            retrievePageOfFiles(request, result);
                        }
                        else {
                            deferred.resolve(result);
                        }
                    });
                };

                var initialRequest = gapi.client.drive.files.list({ q: q });
                retrievePageOfFiles(initialRequest, []);

                return deferred.promise.then(function(rawItems) {
                    var items = rawItems.map(function(rawItem) {
                        return new Item(rawItem);
                    });

                    items.sort(function(a, b) {
                        if (a.isDir == b.isDir)
                            return a.name < b.name ? -1 : 1;
                        else
                            return a.isDir ? -1 : 1;
                    });

                    return items;
                });
            }
        };
    });