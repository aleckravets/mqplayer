(function() {
//    var auth = ['$q', '$location', 'session', '$timeout', function($q, $location, session, $timeout) {
//        if (session.loggedIn() === undefined) {
//            return session.autoLogin()
//                .catch(function(){});
//        }
//    }];

    angular.module('app')
        .config(function($routeProvider) {
            $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeController'});
            $routeProvider.when('/help', {templateUrl: 'partials/help.html'});
            $routeProvider.otherwise({redirectTo: '/'});
        });
}());