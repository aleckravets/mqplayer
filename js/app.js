'use strict';

angular.module('App', ['Tree', 'Player', 'Services'])
    .controller('Controller', ['$scope', 'DataService', function($scope, DataService) {
        $scope.authenticated = false;

        var client = DataService.client;

        client.authenticate({interactive: false}, function(error, client) {
            if (error) {

            }
            else {
                if (client.isAuthenticated()) {
                    client.getAccountInfo(function(error, accountInfo) {
                        if (error) {
                            return showError(error);  // Something went wrong.
                        }

                        $scope.username = accountInfo.name;
                        $scope.authenticated = true;
                        $scope.$apply();
                    });
                }
            }
        });

        $scope.authenticate = function() {
            client.authenticate(function(error, client) {
            });
        }
    }]);


