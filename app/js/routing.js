(function() {
//    var auth = ['$q', '$location', 'session', '$timeout', function($q, $location, session, $timeout, clients) {
//    }];

    var loadClientsPromise;
    var loadClients = ['clients', '$q', function(clients, $q) {
        if (!loadClientsPromise){
            clients.available().forEach(function (client) {
                var p = clients.load(client.name);
                if (loadClientsPromise) {
                    loadClientsPromise = loadClientsPromise.then(function () {
                        return p;
                    });
                }
                else {
                    loadClientsPromise = p;
                }
            });
        }

        return loadClientsPromise;
    }];

    angular.module('app')
        .config(function($routeProvider, $locationProvider) {
            $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeController', resolve: { loadClients: loadClients } });
            $routeProvider.when('/drive', {templateUrl: 'partials/openFromDrive.html', controller: 'OpenFromDriveController', resolve: { loadClients: loadClients } });
            $routeProvider.when('/help', {templateUrl: 'partials/help.html'});
            $routeProvider.otherwise({redirectTo: '/'});

            // server side configuration:
            // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode
            $locationProvider.html5Mode(true);
        });
}());