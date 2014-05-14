'use strict';

angular.module('Services', [])
    .factory('DataService', ['$http', '$q', '$timeout', function($http, $q, $timeout){
        var clientid = '97071318931-0pqadkdeov03b36bhthnri1n3h64eg7d.apps.googleusercontent.com';

        var scopes = [
            'https://www.googleapis.com/auth/drive.readonly'
        ];

        return {
            authorized: false,
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
                        deferred.resolve();
                    }
                });

                return deferred.promise.then(function() {
                    $timeout(function() {}); // digest!
                });
            },
            loadItemsData: function(parentid) {
                var deferred = $q.defer();

                var q = "'" + parentid + "' in parents and trashed = false";

                var retrievePageOfFiles = function(request, result) {
                    request.execute(function(resp) {
                        result = result.concat(resp.items);
                        var nextPageToken = resp.nextPageToken;
                        if (nextPageToken) {
                            request = gapi.client.drive.files.list({
                                pageToken: nextPageToken,
                                q: q
                            });
                            retrievePageOfFiles(request, result);
                        } else {
                            deferred.resolve(result);
                        }
                    });
                }
                var initialRequest = gapi.client.drive.files.list({q: q});
                retrievePageOfFiles(initialRequest, []);

                return deferred.promise.then(function(items) {
                    var res = [];

                    items.forEach(function(item) {
                        res.push({
                            resourceType: item.mimeType == 'application/vnd.google-apps.folder' ? 'dir' : 'file',
                            displayName: item.title,
                            href: item.id,
                            url: item.webContentLink
                        });
                    });

                    return { data: res };
                });
//
//
//
//                var deferred = $q.defer();
//
//                client.readdir(path, function(error, entries, stat, entry_stats) {
//                    if (error) {
//                        deferred.reject(error);
//                    }
//
//                    var items = [];
//
//                    entry_stats.forEach(function(item) {
//                        items.push({
//                            resourceType: item.isFolder ? 'dir' : 'file',
//                            displayName: item.name,
//                            href: item.path
//                        });
//                    });
//
//                    items = items.sort(function(a, b) {
//                        if (a.resourceType != b.resourceType)
//                            return a.resourceType == 'dir' ? -1 : 1;
//                        else
//                            return a.displayName < b.displayName ? -1 : 1;
//                    });
//
//                    var response = {
//                        data: items
//                    };
//
//                    deferred.resolve(response);
//                });
//
//                return deferred.promise;
            },
            getFileUrl: function(path) {
                var deferred = $q.defer();

                client.makeUrl(path, {download: true}, function(error, shareUrl) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        deferred.resolve(shareUrl.url)
                    }
                });

                return deferred.promise;
            }
        };

//        var client = new Dropbox.Client({ key: "qfd1sjynxut1kkw" });
//
//        return {
//            client: client,
//
//            getCachedCredentials: function() {
//                var deferred = $q.defer();
//
//                client.authenticate({interactive: false}, function(error, client) {
//                    if (error) {
//                        deferred.reject(new Error(error));
//                    }
//                    else {
//                        deferred.resolve(client);
//                    }
//                });
//
//                return deferred.promise;
//            },
//            loadItemsData: function(path) {
//                var deferred = $q.defer();
//
//                client.readdir(path, function(error, entries, stat, entry_stats) {
//                    if (error) {
//                        deferred.reject(error);
//                    }
//
//                    var items = [];
//
//                    entry_stats.forEach(function(item) {
//                        items.push({
//                            resourceType: item.isFolder ? 'dir' : 'file',
//                            displayName: item.name,
//                            href: item.path
//                        });
//                    });
//
//                    items = items.sort(function(a, b) {
//                        if (a.resourceType != b.resourceType)
//                            return a.resourceType == 'dir' ? -1 : 1;
//                        else
//                            return a.displayName < b.displayName ? -1 : 1;
//                    });
//
//                    var response = {
//                        data: items
//                    };
//
//                    deferred.resolve(response);
//                });
//
//                return deferred.promise;
//            },
//            getFileUrl: function(path) {
//                var deferred = $q.defer();
//
//                client.makeUrl(path, {download: true}, function(error, shareUrl) {
//                    if (error) {
//                        deferred.reject(error);
//                    }
//                    else {
//                        deferred.resolve(shareUrl.url)
//                    }
//                });
//
//                return deferred.promise;
//            }
//        };
    }]);
 
