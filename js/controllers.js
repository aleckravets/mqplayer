angular.module('App')
    .controller('AppController', function($scope, $location, $timeout, session) {
        $scope.session = session;

        $scope.login = function() {
            session.login()
                .then(function() {
                    $scope.loggedin = true;
                    console.log('redirect to player');
                    $location.path('/');
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

            $timeout(function(){ });
        };

        $scope.next = function(implicit) {
            var playlist = session.playlist,
                player = session.player;

            var rec = playlist.next(player.currentRecord);

            if (rec !== false)
                player.playRecord(rec);
            else if (implicit)
                player.stop();

            $timeout(function(){ });
        };

        $scope.playPause = function() {
            var playlist = session.playlist,
                player = session.player;

            if (player.state == 'paused') {
                player.play();
            }
            else if (player.state == 'stopped') {
                if (playlist.selectedRecords.length > 0) {
                    player.playRecord(playlist.selectedRecords[playlist.selectedRecords.length - 1]);
                }
                else if (playlist.records.length > 0) {
                    player.playRecord(playlist.records[0]);
                }
            }
            else {
                player.pause();
            }
            $timeout(function(){ });
        }

        $scope.stop = function() {
            session.player.stop()
        };

        $scope.$on('trackended', function(event, data) {
            $scope.next(true);
            $timeout(function(){ });
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

        $scope.$on('trackended', function(event) {
            $timeout(function(){ });
        });

        player.audio.addEventListener('timeupdate', function() {
            $timeout(function() {});
        });

        console.log('player controller');
    })
    .controller('LoginController', function($scope) {
    });