angular.module('App')
    .controller('AppController', function($scope, $timeout, DataService, Session) {
        $scope.logout = function() {
            DataService.signOut()
                .then(function() {
                    Session.reset();
                    $timeout(function() {});
                });
        };

        $scope.svc = DataService;

        var player = Session.player;

        player.audio.addEventListener('ended', function() {
            $timeout(function() {});
        });

        player.audio.addEventListener('timeupdate', function() {
            $timeout(function() {});
        });

        player.audio.volume = 0.5;

        $scope.player = player;
    })
    .controller('PlayerController', function($scope, $timeout, DataService, Session) {
        $scope.player = Session.player;
        $scope.svc = DataService;

        $scope.login = function(immediate) {
            DataService.authorize(immediate)
                .then(function(authorized) {
                    if (authorized) {
                        $timeout(function() {});
                    }
                })
                .catch(function(error) {
                    console.log('failed to login: ' + error);
                });
        };

        if (DataService.authorized === undefined)
            $scope.login(true); // try to auto login
    });