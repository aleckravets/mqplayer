'use strict';

angular.module('App', ['ngRoute', 'Tree', 'Player', 'Services'])
    .controller('Controller', ['$scope', 'DataService', function($scope, DataService) {
        // try to auto login
        DataService.authorize(true);

        $scope.svc = DataService;
    }]);
