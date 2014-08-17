'use strict';

angular.module('services')
    .factory('clients', function($q, Drive, DropboxClient){
        var that = {};

        var clients = [];

        var loadPromises = {};

        that.load = function(name) {
            // todo: verify name...
            if (!loadPromises[name]) {
                var deferred = $q.defer();
                var client;

                switch (name) {
                    case 'drive':
                        // a bit ugly
                        window.gapi_loaded_deferred = deferred;
                        client = Drive;
                        $script("//apis.google.com/js/client.js?onload=gapi_loaded");
                        break;
                    case 'dropbox':
                        client = DropboxClient;
                        $script("//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.3/dropbox.min.js", function() {
                            deferred.resolve();
                        });
                        break;
                }

                loadPromises[name] = deferred.promise
                    .then(function() {
                        that[name] = new client();
                        clients.push(that[name]);
                        return that[name];
                    });
            }

            return loadPromises[name];
        };

        that.get = function(activeOnly) {
            if (activeOnly) {
                return clients.filter(function(client) { return client.isLoggedIn(); });
            }
            else {
                return clients;
            }
        };

        that.isLoaded = function (name) {
            return that[name] !== undefined;
        }

        return that;
    });

function gapi_loaded() {
    gapi.client.load('drive', 'v2', function() {
        gapi_loaded_deferred.resolve();
    });
}