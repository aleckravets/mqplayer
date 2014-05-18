'use strict';

angular.module('App', ['ngRoute', 'Tree', 'Playlist', 'Player', 'Services'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/player', {templateUrl: 'views/player.html', controller: 'PlayerController'});
        $routeProvider.when('/about', {templateUrl: 'views/about.html'});
        $routeProvider.when('/help', {templateUrl: 'views/help.html'});
        $routeProvider.otherwise({redirectTo: '/player'});
    }]);
