'use strict';

angular.module('Services', [])
    .factory('DataService', ['$http', '$q', function($http, $q){
        var client = new Dropbox.Client({ key: "qfd1sjynxut1kkw" });

        // get cached credentials
        client.authenticate({interactive: false}, function(error, client) {
            if (error) {
                console.log(error);
            }
            if (client.isAuthenticated()) {
                // Cached credentials are available, make Dropbox API calls.

            }
        });

        return {
            client: client,

            getCachedCredentials: function() {
                var deferred = $q.defer();

                client.authenticate({interactive: false}, function(error, client) {
                    if (error) {
                        deferred.reject(new Error(error));
                    }
                    else {
                        deferred.resolve(client);
                    }
                });

                return deferred.promise;
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

                    var response = {
                        data: items
                    };

                    deferred.resolve(response);
                });

                return deferred.promise;
            },
            getFileUrl: function(path) {
//                return url + '?getfile=' + encodeURIComponent(path);
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
    }]);
 
