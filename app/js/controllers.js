'use strict';

angular.module('app')
    .controller('AppController', function($scope, $location, session, page, helper) {
        $scope.page = page;

        $scope.session = session;

        $scope.login = function() {
            session.login()
                .then(function() {
                    var search = $location.search();
                    var url = search.ret ? decodeURIComponent(search.ret) : '/';
                    $location.url(url);
                });
        };

        $scope.logout = function() {
            session.logout()
                .then(function() {
                    $scope.loggedin = false;
                    $location.path('/login');
                });
        };
    })
    .controller('PlayerController', function() {
    })
    .controller('LoginController', function($scope, session) {
        $scope.session = session;
    });
