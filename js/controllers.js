angular.module('App')
    .controller('AppController', function($scope, $timeout, DataService, player) {
        $scope.logout = function() {
            DataService.signOut()
                .then(function() {
                    Session.end();
                    $timeout(function() {});
                });
        };

        $scope.svc = DataService;

//        var player = Session.player;
//
//        player.audio.addEventListener('ended', function() {
//            $timeout(function() {});
//        });
//
//        player.audio.addEventListener('timeupdate', function() {
//            $timeout(function() {});
//        });
//
//        player.audio.volume = 0.5;
//
//        $scope.player = player;
    })
    .controller('PlayerController', function($scope, $timeout, DataService, Session) {

        $scope.svc = DataService;

        $scope.login = function(immediate) {
            DataService.authorize(immediate)
                .then(function(authorized) {
                    if (authorized) {
                        Session.start();
                        $scope.player = Session.player;
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