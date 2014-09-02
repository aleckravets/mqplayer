'use strict';

angular.module('app')
    .controller('AccountsController', function($scope, clients, helper) {
        $scope.services =
            clients.available().map(function(srv) {
                var service = {
                    name: srv.name,
                    title: srv.title,
                    loggedIn: clients.isLoggedIn(srv.name)
                };

                if (service.loggedIn) {
                    var client = clients[service.name];

                    service.user = client.user.email || client.user.name;

                    if (client.user.quota && client.user.used !== undefined) {
                        var percentage = Math.floor(client.user.used / client.user.quota * 100);
                        service.stats = helper.formatBytes(client.user.used) + ' (' + percentage + '%) of ' + helper.formatBytes(client.user.quota) + ' used';
                    }
                }

                return service;
            });
    });