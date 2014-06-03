angular.module('App')
    .controller('AppController', function($scope, $location, $timeout, $document, session, Page) {
        $scope.Page = Page;

        $scope.session = session;

        $scope.state = {};

        $scope.$on('player.timeupdate', function(e, time) {
            if (time > 0 && $scope.state.currentTime && Math.abs(time - $scope.state.currentTime) <= 1)
                return;

            $scope.state.currentTime = Math.round(time);
            $timeout(function(){});
        });

        $scope.$watch('state.currentTime', function(value) {
            if (session.player && Math.abs(value - session.player.audio.currentTime) > 1) {
                session.player.setTime(value);
            }
        });

        $scope.login = function() {
            session.login()
                .then(function() {
                    $scope.loggedin = true;
                    $location.path('/');
                });
        };

        $scope.logout = function() {
            session.logout()
                .then(function() {
                    $scope.loggedin = false;
                    $location.path('/login');
                });
        };

        $scope.prev = function() {
            var playlist = session.playlist,
                player = session.player;

            var rec = playlist.prev(player.currentRecord);

            if (rec !== false)
                player.playRecord(rec);

            $scope.state.currentTime = 0;
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

            $scope.state.currentTime = 0;
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
            session.player.stop();
            $scope.state.currentTime = 0;
        };

        $scope.$on('player.trackended', function(event, data) {
            $scope.next(true);
            $timeout(function(){ });
        });

        $document.on('keydown', function(e) {
            var playlist = session.playlist,
                player = session.player;

            switch (e.keyCode) {
                case 98: // numpad down
                    player.volumeDown();
                    $scope.$apply();
                    break;
                case 104: // numpad up
                    player.volumeUp();
                    $scope.$apply();
                    break;
                // todo: add a delay before the record starts loading when manual navigation is used
                case 37: // left arrow
                case 100: // numpad left
                    $scope.prev();
                    break;
                case 39: // right arrow
                case 102: // numpad right
                    $scope.next();
                    break;
                default:
                    break;
            }
        });
    })
    // todo: remove handlers on $destroy
    .controller('PlayerController', function($scope, $timeout, $location, session) {
        var player = session.player;

        $scope.$on('player.trackended', function(event) {
            $timeout(function(){ });
        });

        var currentTime;

//        session.player.audio.addEventListener('timeupdate', function(e) {
//            if (currentTime && session.player.audio.currentTime - currentTime <= 1)
//                return;
//
//            $timeout(function() {});
//        });

    })
    .controller('LoginController', function($scope) {
    });
