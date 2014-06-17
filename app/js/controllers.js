'use strict';

angular.module('app')
    .controller('AppController', function($scope, $location, session, page) {
        $scope.page = page;

        $scope.session = session;

        $scope.login = function() {
            session.login()
                .then(function() {
                    $location.path('/');
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
    .controller('PlayerController', function($scope, $location, helper, session) {
        helper.checkState();
    })
    .controller('LoginController', function($scope, session) {
        $scope.session = session;
    });
