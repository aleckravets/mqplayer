(function() {
    var auth = ['$q', '$location', 'session', '$timeout', function($q, $location, session, $timeout) {
        if (!session.isLoggedIn()) {
            session.isLogginIn = true;
            return session.login(true)
                .catch(function () {
                    if ($location.path() !== '/login') {
                        $location.url('/login?ret=' + encodeURIComponent($location.url()));

                        var d = $q.defer();
                        d.reject();
                        return d.promise;
                    }
                })
                .finally(function() {
                    session.isLogginIn = false;
                });
        }
    }];

    angular.module('app')
        .config(function($routeProvider) {
            $routeProvider.when('/', {templateUrl: 'partials/player.html', controller: 'PlayerController', resolve: { auth: auth }});
            $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController', resolve: { auth: auth }});
            $routeProvider.when('/about', {templateUrl: 'partials/about.html'});
            $routeProvider.when('/help', {templateUrl: 'partials/help.html'});
            $routeProvider.otherwise({redirectTo: '/'});
        });
}());