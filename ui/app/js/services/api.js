'use strict';

angular.module('services')
    .factory('api', function($http, $q, clients) {
        var baseUrl = 'http://181.214.69.130:8080', tokens = {};

        return {
            setAuthHeader: function() {
                $http.defaults.headers.common.Authorization = angular.toJson(tokens);
            },
            addToken: function(service, token) {
                tokens[service] = token;
                this.setAuthHeader();
            },
            removeToken: function(service) {
                tokens[service] = undefined;
                this.setAuthHeader();
            },

            request: function(method, url, data) {
                var deferred = $q.defer();
                var result;

                if (method == 'post') {
                    result = $http.post(baseUrl + url, data);
                }
                else {
                    result = $http[method](baseUrl + url);
                }

                result
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data);
                    });

                return deferred.promise;
            },

            get: function(url) {
                return this.request('get', url);
            },

            post: function(url, data) {
                return this.request('post', url, data);
            },

            delete: function(url) {
                return this.request('delete', url);
            },

            /**
             * Register new token at backend and store it to use for further authentication
             * @param {String} service
             * @param {String} token
             * @returns {Promise}
             */
            login: function(service, token) {
                //return $q.when(1);
                var self = this;
                return this.post('/token', {service: service, token: token})
                    .then(function(account) {
                        self.addToken(service, token);
                        return account;
                    });
            }
        };
    });
