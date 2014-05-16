'use strict';

angular.module('App', ['ngRoute', 'Tree', 'Player', 'Services'])
    .controller('Controller', ['$scope', 'DataService', function($scope, DataService) {
        DataService.authorize(true); // try to auto login
        $scope.svc = DataService;
    }]);
