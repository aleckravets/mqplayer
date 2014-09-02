'use strict';

angular.module('app')
    .controller('AppController', function($scope, $location, $timeout, session, page, helper, clients, $document, $route) {
        // preload clients
        clients.available().forEach(function(client) {
            clients.load(client.name);
        });

        $scope.page = page;

        $scope.session = session;

//        $scope.clients = clients;

        $scope.login = function(service) {
            session.login(service);
        };

        $scope.logout = function(service) {
            session.logout(service);
        };

        $scope.accountsOpen = false;

        $scope.toggleAccounts = function(show) {
            if (show !== undefined) {
                $scope.accountsOpen = show;
            }
            else {
                $scope.accountsOpen = !$scope.accountsOpen;
            }
        };

        // hm...
        $(document).on('mousedown', function(e) {
            if ($(e.target).parents('.dropdown').length === 0) {
                $scope.$apply(function() {
                    $scope.toggleAccounts(false);
                });
            }
        });

        $(document).on('click.bs.dropdown.data-api', '.accounts button', function (e) {
            $scope.$apply(function() {
                $scope.toggleAccounts(false);
            });
        });
    });