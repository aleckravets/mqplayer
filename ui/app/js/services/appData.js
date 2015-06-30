'use strict';

angular.module('services')
    .factory('appData', function() {
        var storage = window.localStorage;

        var serializable = ['playlists', 'services'];

        var appData = {
            playlists: {},
            services: [],
            save: function() {
                var self = this;
                serializable.forEach(function(key) {
                    storage.setItem(key, angular.toJson(self[key]));
                });
            },
            restore: function() {
                var self = this;
                serializable.forEach(function(key) {
                    try {
                        var value = angular.fromJson(storage[key]);

                        if (value) {
                            self[key] = value;
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                });
            }
        };

        appData.restore();

//        console.log('appData', appData);
//        console.log('storage', storage);

        return appData;
    });