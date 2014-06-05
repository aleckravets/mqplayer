angular.module('App')
    .controller('AppController', function($scope, $location, $timeout, $document, session, Page) {
        $scope.Page = Page;

        $scope.session = session;

        $scope.login = function() {
            session.login()
                .then(function() {
                    $scope.loggedin = true;
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
    .controller('PlayerController', function() {
    })
    .controller('LoginController', function() {
    });
