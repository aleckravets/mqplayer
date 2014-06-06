'use strict';

angular.module('Types', []);
angular.module('Services', ['Types'])
angular.module('Directives', ['Types', 'Services', 'ui.slider'])

angular.module('App', ['ngRoute', 'Directives', 'Services', 'Types'])
    .config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/player.html',
            controller: 'PlayerController',
            resolve: {
                auth: auth
            }});

        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});
        $routeProvider.when('/about', {templateUrl: 'partials/about.html'});
        $routeProvider.when('/help', {templateUrl: 'partials/help.html'});
        $routeProvider.otherwise({redirectTo: '/'});
    })
    .factory('Page', function() {
        var title = 'Music Queue';
        return {
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle }
        };
    });

var auth = ['$q', '$location', 'session', function($q, $location, session) {
    if (!session.active) {
        var deferred = $q.defer();

        session.authorizing = true;

        session.login(true)
            .then(function() {
                session.authorizing = false;
                deferred.resolve();
            })
            .catch(function() {
                session.authorizing = false;
                deferred.reject();
                $location.path('/login');
            });

        return deferred.promise;
    }
}];
