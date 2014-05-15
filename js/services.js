'use strict';

angular.module('Services', [])
    .factory('DataService', ['$http', '$q', '$timeout', function($http, $q, $timeout){
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
                        deferred.resolve();
                    }
                });

                return deferred.promise.then(function() {
                    $timeout(function() {}); // digest!
                });
            },
            signOut: function() {
                gapi.auth.signOut();
            },
            loadItemsData: function(parentid) {
                var deferred = $q.defer();

                var q = "'" + parentid + "' in parents and trashed = false";

                var retrievePageOfFiles = function(request, result) {
                    request.execute(function(resp) {
                        result = result.concat(resp.items);
                        var nextPageToken = resp.nextPageToken;
                        if (nextPageToken) {
                            request = gapi.client.drive.files.list({ q: q, pageToken: nextPageToken });
                            retrievePageOfFiles(request, result);
                        } else {
                            deferred.resolve(result);
                        }
                    });
                }
                var initialRequest = gapi.client.drive.files.list({ q: q });
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
            }
        };
    }]);
 
