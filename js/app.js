'use strict';

angular.module('App', ['ngRoute', 'Tree', 'Player', 'Services'])
    .controller('Controller', ['$scope', 'DataService', function($scope, DataService) {
        $scope.authorize = function() {
            DataService.authorize();
        }

        DataService.tryAuthorize().then(function (authorized) {
            $scope.authorized = authorized;
        });
    }])
//    .config(function($routeProvider){
//        $routeProvider
//            .when('/', {controller:'Controller', resolve:{ 'DataService': function() {
//
//            } }});
//    })
;
