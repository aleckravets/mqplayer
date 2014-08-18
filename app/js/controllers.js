'use strict';

angular.module('app')
    .controller('AppController', function($scope, $location, $timeout, session, page, helper, clients) {
        $scope.page = page;

        $scope.session = session;

        $scope.clients = clients.available();

        $scope.login = function(service) {
            session.login(service)
                .then(function() {
                    var search = $location.search();
                    var url = search.ret ? decodeURIComponent(search.ret) : '/';
                    $location.url(url);
                });
        };

        $scope.logout = function() {
            session.logout()
                .then(function() {
                    $scope.$apply(angular.noop);
                });
        };
    })
    .controller('PlayerController', function() {
    })
    .controller('LoginController', function($scope, session) {
        $scope.session = session;
    })
    .controller('OAuthController', function($scope) {
        console.log('oauth controller');
    })
;
