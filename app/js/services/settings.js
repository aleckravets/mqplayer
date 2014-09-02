'use strict';

angular.module('services')
    .factory('settings', function(){
        var storage = window.localStorage,
            key = 'mq.settings',
            settings = {
                services: []
            };

        function store() {
            storage.setItem(key, angular.toJson(settings));
        }

        function restore() {
            var jsonString = storage.getItem(key);

            try {
                var values = angular.fromJson(jsonString);
                angular.extend(settings, values);
            }
            catch (error) {
                console.log(error);
            }
        }

        function log() {
            console.log('settings', settings);
            console.log('storage', storage);
        }

        var api = {
            get: function(key) {
                return settings[key];
            },
            set: function(key, value) {
                settings[key] = value;
                store();
            },
            rememberService: function(service) {
                if (settings.services.indexOf(service) === -1) {
                    settings.services.push(service);
                    store();
                }
            },
            forgetService: function(service) {
                var index = settings.services.indexOf(service);

                if (index !== -1) {
                    settings.services.splice(index, 1);
                    store();
                }
            },
            forgetAllServices: function() {
                settings.services = [];
                store();
            }
        };

        restore();

        return api;
    });