(function() {
//    var auth = ['$q', '$location', 'session', '$timeout', function($q, $location, session, $timeout) {
//        if (session.loggedIn() === undefined) {
//            return session.autoLogin()
//                .catch(function(){});
//        }
//    }];

    angular.module('app')
        .config(function($routeProvider, $locationProvider) {
            $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeController', resolve: {openWith: openWith}});
            $routeProvider.when('/help', {templateUrl: 'partials/help.html'});
            $routeProvider.otherwise({redirectTo: '/'});

            $locationProvider.html5Mode(true);
        });
}());