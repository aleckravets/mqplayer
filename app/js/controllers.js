'use strict';

angular.module('app')
    .controller('AppController', function($scope, $location, $timeout, session, page, helper, clients, $document) {
        $scope.page = page;

        $scope.session = session;

        $scope.clients = clients;

        $scope.available = clients.available();

        $scope.login = function(service) {
            session.login(service)
                .then(function() {
                    if ($location.path !== '/') {
                        var search = $location.search();
                        var url = search.ret ? decodeURIComponent(search.ret) : '/';
                        $location.url(url);
                    }
                });
        };

        $scope.logout = function(service) {
            session.logout(service)
                .then(function() {
                    if (session.isLoggedIn()) {
                        $timeout(angular.noop);
                    }
                    else {
                        if ($location.path() === '/') {
                            $location.url('/login');
                        }
                    }
                });
        };

        $scope.toggleLogin = function(service) {
            if (!clients[service].isLoggedIn()) {
                $scope.login(service);
            }
            else {
                $scope.logout(service);
            }
        };
    })
    .controller('PlayerController', function() {
    })
    .controller('LoginController', function($scope, session) {
        $scope.session = session;
    })
    .controller('OAuthController', function($scope) {
        console.log('oauth controller');
    })
;
