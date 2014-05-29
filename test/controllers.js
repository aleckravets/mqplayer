'use strict';

var app = angular.module('app', []);

app.controller('AppController', function($scope) {
    $scope.click = function() {
        $scope.test = 'hi';
    };

    $scope.$watch('test', function() {
        $scope.test = Math.random();
    });

    $scope.test = 'hello world';

    setTimeout(function() {
        $scope.$apply(function() {
            $scope.test = 'time out test';
        });
        console.log('time out fired');
    }, 500);

});