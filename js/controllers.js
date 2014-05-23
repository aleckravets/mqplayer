angular.module('App')
    .controller('AppController', function($scope, $location, session) {
        $scope.session = session;

        $scope.login = function() {
            session.login()
                .then(function() {
                    $scope.loggedin = true;
                    console.log('redirect to player');
                    $location.path('/player');
                });
        };

        $scope.logout = function() {
            session.logout()
                .then(function() {
                    $scope.loggedin = false;
                    console.log('redirect to login');
                    $location.path('/login');
                });
        };

        $scope.prev = function() {
            var playlist = session.playlist,
                player = session.player;

            var rec = playlist.prev(player.currentRecord);

            if (rec !== false)
                player.playRecord(rec);
        };

        $scope.next = function(implicit) {
            var playlist = session.playlist,
                player = session.player;

            var rec = playlist.next(player.currentRecord);

            if (rec !== false)
                player.playRecord(rec);
            else if (implicit)
                player.stop();
        };

        $scope.playPause = function() {
            var playlist = session.playlist,
                player = session.player;

            if (player.isPaused()) {
                if (player.currentRecord) {
                    player.play();
                }
                else if (playlist.selectedRecords.length > 0) {
                    player.playRecord(playlist.selectedRecords[playlist.selectedRecords.length - 1]);
                }
                else if (playlist.length > 0) {
                    player.playRecord(playlist[0]);
                }
            }
            else {
                player.pause();
            }
        }

        $scope.stop = function() {
            session.player.stop()
        };

        $scope.$on('playerEnded', function(event, data) {
            $scope.next(true);
        });

//        var self = this;
//        this.audio.addEventListener('ended', function() {
//            self.next(true);
//        });

        console.log('app controller');
    })
    // todo: remove handlers on $destroy!!!
    .controller('PlayerController', function($scope, $timeout, $location, session) {
        var player = session.player;

        player.audio.addEventListener('ended', function() {
            $timeout(function() {});
        });

        player.audio.addEventListener('timeupdate', function() {
            $timeout(function() {});
        });

        console.log('player controller');
    })
    .controller('LoginController', function($scope) {
    });