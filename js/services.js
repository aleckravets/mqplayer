'use strict';

angular.module('Services', [])
    .factory('DataService', ['$http', '$q', function($http, $q){
        var clientid = '97071318931-0pqadkdeov03b36bhthnri1n3h64eg7d.apps.googleusercontent.com';

        var scopes = [
            'https://www.googleapis.com/auth/drive.readonly'
        ];

        return {
            tryAuthorize: function() {
                var deferred = $q.defer();

                gapi.auth.authorize({'client_id': clientid, 'scope': scopes.join(' '), 'immediate': true}, function(authResult) {
                    if (authResult && !authResult.error) {
                        var request = gapi.client.drive.about.get();
                        console.log(1);
                        request.execute(function(resp) {
                            console.log('Current user name: ' + resp.name);
                            console.log('Root folder ID: ' + resp.rootFolderId);
                            console.log('Total quota (bytes): ' + resp.quotaBytesTotal);
                            console.log('Used quota (bytes): ' + resp.quotaBytesUsed);

                        });
                        deferred.resolve(true);
                    }
                    else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;
            },
            authorize: function() {
                gapi.auth.authorize({'client_id': clientid, 'scope': scopes.join(' '), 'immediate': false}, function(authResult) {
                    if (authResult && !authResult.error) {
                        console.log('authorized expl');
                    }
                    else {
                        console.log('failed to auth expl');
                    }
                });
            },
            loadItemsData: function(path) {
                var deferred = $q.defer();

                client.readdir(path, function(error, entries, stat, entry_stats) {
                    if (error) {
                        deferred.reject(error);
                    }

                    var items = [];

                    entry_stats.forEach(function(item) {
                        items.push({
                            resourceType: item.isFolder ? 'dir' : 'file',
                            displayName: item.name,
                            href: item.path
                        });
                    });

                    items = items.sort(function(a, b) {
                        if (a.resourceType != b.resourceType)
                            return a.resourceType == 'dir' ? -1 : 1;
                        else
                            return a.displayName < b.displayName ? -1 : 1;
                    });

                    var response = {
                        data: items
                    };

                    deferred.resolve(response);
                });

                return deferred.promise;
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
 
