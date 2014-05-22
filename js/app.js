'use strict';

angular.module('App', ['ngRoute', 'Tree', 'Playlist', 'Player', 'Services'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/player', {
            templateUrl: 'views/player.html',
            controller: 'PlayerController',
            resolve: {
                autologin: function(session) {
                    if (!session.active)
                        return session.login(true)
                            .then(function() {})
                            .catch(function() {});
                }
            }});

        $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: 'LoginController'});
        $routeProvider.when('/about', {templateUrl: 'views/about.html'});
        $routeProvider.when('/help', {templateUrl: 'views/help.html'});
        $routeProvider.otherwise({redirectTo: '/player'});
    }]);
