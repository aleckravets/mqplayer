'use strict';

angular.module('App', ['ngRoute', 'Tree', 'Playlist', 'Player', 'Services'])
    .config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/player.html',
            controller: 'PlayerController',
            resolve: {
                auth: auth
            }});

        $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: 'LoginController'});
        $routeProvider.when('/about', {templateUrl: 'views/about.html'});
        $routeProvider.when('/help', {templateUrl: 'views/help.html'});
        $routeProvider.otherwise({redirectTo: '/'});
    });

var auth = function($q, $location, session) {
    if (!session.active) {
        var deferred = $q.defer();

        session.login(true)
            .then(function() {
                deferred.resolve();
            })
            .catch(function() {
                console.log('redirect to login');
                deferred.reject();
                $location.path('/login');
            });

        return deferred.promise;
    }
};
