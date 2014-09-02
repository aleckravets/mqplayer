(function() {
//    var auth = ['$q', '$location', 'session', '$timeout', function($q, $location, session, $timeout, clients) {
//    }];

    angular.module('app')
        .config(function($routeProvider, $locationProvider) {
            $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeController' });
            $routeProvider.when('/drive', {templateUrl: 'partials/openFromDrive.html', controller: 'OpenFromDriveController'});
            $routeProvider.when('/help', {templateUrl: 'partials/help.html'});
            $routeProvider.otherwise({redirectTo: '/'});

            // server side configuration:
            // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode
            $locationProvider.html5Mode(true);
        });
}());