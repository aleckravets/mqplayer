angular.module('App')
    .controller('AppController', function($scope, $timeout, DataService, Player) {
        console.log('app controller created');

        $scope.logout = function() {
            DataService.signOut()
                .then(function() {
                    $timeout(function() {});
                });
        };

        $scope.svc = DataService;

        Player.audio.addEventListener('ended', function() {
            $scope.$apply();
        });

        Player.audio.addEventListener('timeupdate', function() {
            $scope.$apply();
        });

        Player.audio.volume = 0.5;

        $scope.player = Player;
    })
    .controller('PlayerController', function($scope, $timeout, DataService, Player) {
        console.log('player controller created');

        $scope.player = Player;
        $scope.svc = DataService;

        $scope.login = function(immediate) {
            DataService.authorize(immediate)
                .then(function(authorized) {
                    if (authorized)
                        $timeout(function() {});
                })
                .catch(function(error) {
                    console.log('failed to login: ' + error);
                });
        };

        if (DataService.authorized === undefined)
            $scope.login(true); // try to auto login
    });