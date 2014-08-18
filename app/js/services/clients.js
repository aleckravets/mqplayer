'use strict';

angular.module('services')
    .factory('clients', function($q, Drive, DropboxClient){
        var that = {};

        var clients = {
            drive: {title: 'Google Drive', class: Drive},
            dropbox: {title: 'Dropbox', class: DropboxClient, api: "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.3/dropbox.min.js"}
        };

        var instances = [];

        var loadPromises = {};

        that.load = function(name) {
            // todo: verify name...
            if (!loadPromises[name]) {
                var deferred = $q.defer(),
                    client = clients[name];

                switch (name) {
                    case 'drive':
                        // a bit ugly
                        window.gapi_loaded_deferred = deferred;
                        $script("//apis.google.com/js/client.js?onload=gapi_loaded");
                        break;
                    default:
                        $script(client.api, function() {
                            deferred.resolve();
                        });
                        break;
                }

                loadPromises[name] = deferred.promise
                    .then(function() {
                        var instance = new client.class();

                        instance.name = name;
                        instance.title = client.title;

                        that[name] = instance;

                        instances.push(instance);

                        return that[name];
                    });
            }

            return loadPromises[name];
        };

        that.get = function(activeOnly) {
            if (activeOnly) {
                return instances.filter(function(client) { return client.isLoggedIn(); });
            }
            else {
                return instances;
            }
        };

        that.available = function() {
            var available = [],
                name;

            for (name in clients) {
                available.push({name: name, title: clients[name].title});
            }

            return available;
        };

        that.isLoaded = function (name) {
            return that[name] !== undefined;
        };

        return that;
    });

function gapi_loaded() {
    gapi.client.load('drive', 'v2', function() {
        gapi_loaded_deferred.resolve();
    });
}