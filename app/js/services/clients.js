'use strict';

angular.module('services')
    .factory('clients', function($q, Drive){
        var that = {};

        var clients = [];

        that.load = function(name) {
            // todo: verify name...
            // todo: check if loaded already
            var deferred = $q.defer();
            var client;

            if (name === 'drive') {
                // a bit ugly
                window.gapi_loaded_deferred = deferred;
                $script("https://apis.google.com/js/client.js?onload=gapi_loaded");
                client = Drive;
            }

            return deferred.promise
                .then(function() {
                    that[name] = new client();
                    clients.push(that[name]);
                    return that[name];
                });
        };

        that.get = function(activeOnly) {
            if (activeOnly) {
                return clients.filter(function(client) { return client.isLoggedIn(); });
            }
            else {
                return clients;
            }
        };

        return that;
    });

function gapi_loaded() {
    gapi.client.load('drive', 'v2', function() {
        gapi_loaded_deferred.resolve();
    });
}