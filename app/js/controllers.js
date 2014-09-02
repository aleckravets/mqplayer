'use strict';

angular.module('app')
    .controller('AppController', function($scope, $location, $timeout, session, page, helper, clients, $document, $route) {
        // preload clients
        clients.available().forEach(function(client) {
            clients.load(client.name);
        });

        $scope.page = page;

        $scope.session = session;

        $scope.clients = clients;

        $scope.available = clients.available();

        $scope.login = function(service) {
            session.login(service);
        };

        $scope.logout = function(service) {
            session.logout(service);
        };

        $scope.toggleLogin = function(service) {
            if (!clients[service].isLoggedIn()) {
                $scope.login(service);
            }
            else {
                $scope.logout(service);
            }
        };

//        $scope.services = function() {
//            return clients.available().map(function(client) {
//                var account = {
//                    name: client.name,
//                    title: client.title,
//                    loggedIn: client.loggedIn
//                };
//
//                if (account.loggedIn) {
//                    account.username = client.user.email ? client.user.email : client.name;
//
//                    if (client.user.quota && client.user.used !== undefined) {
//                        var percentage;
//                        account.stats = helper.formatBytes(client.user.used) + '(' + percentage + ') of ' + helper.formatBytes(client.user.quota) + ' used';
//                    }
//                }
//
//                return account;
//            });
//        };
    })
    .controller('HomeController', function(session) {
        if (session.loggedIn() === undefined) {
            session.autoLogin();
        }
    })
    .controller('PlayerController', function() {
    })
    .controller('LoginController', function($scope, session) {
        $scope.session = session;
    })
    .controller('OAuthController', function($scope) {
    })
;
