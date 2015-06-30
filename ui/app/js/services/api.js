'use strict';

angular.module('services')
    .factory('api', function($http, $q, clients) {
        var baseUrl = '/api', tokens = {};

        return {
            _setAuthHeader: function() {
                $http.defaults.headers.common.Authorization = angular.toJson(tokens);
            },
            _addToken: function(service, token) {
                tokens[service] = token;
                this._setAuthHeader();
            },
            _removeToken: function(service) {
                tokens[service] = undefined;
                this._setAuthHeader();
            },
            _get: function(url) {
                var deferred = $q.defer();
                $http.get(baseUrl + url)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            _post: function(url, data) {
                var deferred = $q.defer();
                $http.post(baseUrl + url, data)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            /**
             * Register new token at backend and store it to use for further authentication
             * @param {String} service
             * @param {String} token
             * @returns {Promise}
             */
            login: function(service, token) {
                var self = this;
                return this._post('/token', {service: service, token: token})
                    .then(function() {
                        self._addToken(service, token);
                    });
            },
            get: function(url) {
                return this._get(url);
            },
            post: function(url, data) {
                return this._post(url, data);
            }

        };
    });
