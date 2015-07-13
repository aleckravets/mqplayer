'use strict';

// todo: remove handlers on $destroy
angular.module('directives')
    .directive('player', function(session) {
        return {
            restrict: 'E',
            //scope: {},
            templateUrl: 'tmpl/player.html',
            controller: function($scope, $timeout, $document) {
                $scope.session = session;

                $scope.state = {};

                $scope.$on('player.trackended', function(event) {
                    $timeout(function(){ });
                });

                $scope.$watch('state.currentTime', function(value) {
                    if (session.player && Math.abs(value - session.player.audio.currentTime) > 1) {
                        session.player.setTime(value);
                    }
                });

                $scope.$on('player.timeupdate', function(e, time) {
                    if (time > 0 && $scope.state.currentTime && Math.abs(time - $scope.state.currentTime) <= 1) {
                        return;
                    }

                    $timeout(function() {
                        $scope.state.currentTime = Math.round(time);
                    });
                });

                function playRecordAndDigest(rec) {
                    session.player.playRecord(rec)
                        .then(function() {
                            $timeout(angular.noop);
                        })
                        .catch(function(error) {
                            $scope.error(error);
                        });
                }

                $scope.prev = function() {
                    var playlist = session.playlist,
                        player = session.player;

                    var rec = playlist.prev(player.currentRecord);

                    if (rec !== false) {
                        playRecordAndDigest(rec);
                    }

                    $scope.state.currentTime = 0;
                };

                $scope.next = function(implicit) {
                    var playlist = session.playlist,
                        player = session.player;

                    if (!player.currentRecord) {
                        return;
                    }

                    var rec = playlist.next(player.currentRecord);

                    if (rec !== false)
                        playRecordAndDigest(rec);
                    else if (implicit)
                        player.stop();

                    $scope.state.currentTime = 0;
                };

                $scope.playPause = function() {
                    var playlist = session.playlist,
                        player = session.player;

                    if (player.state == 'paused') {
                        player.play();
                    }
                    else if (player.state == 'stopped') {
                        if (playlist.selectedRecords.length > 0) {
                            playRecordAndDigest(playlist.selectedRecords[playlist.selectedRecords.length - 1]);
                        }
                        else if (playlist.records.length > 0) {
                            playRecordAndDigest(playlist.records[0]);
                        }
                    }
                    else {
                        player.pause();
                    }
                }

                $scope.stop = function() {
                    session.player.stop();
                    $scope.state.currentTime = 0;
                };

                $scope.selectAll = function() {

                };

                $scope.$on('player.trackended', function(event, data) {
                    $timeout(function(){
                        $scope.next(true);
                    });
                });

                // todo: remove on destroy

                function shortcut(e) {
                    var playlist = session.playlist,
                        player = session.player;

                    switch (e.keyCode) {
                        case 67: // c
                            $scope.playPause();
                            break;
                        case 88: // x
                        case 13: // enter
                            $scope.stop();
                            $scope.playPause();
                            break;
                        case 82: // r
                            playlist.toggleRepeat();
                            break;
                        case 83: // s
                            playlist.toggleRandom();
                            break;
                        case 77: //m
                            player.mute();
                            break;
                        case 98: // numpad down
                            player.volumeDown();
                            break;
                        case 104: // numpad up
                            player.volumeUp();
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
                            return;
                    }

                    $timeout(angular.noop);

                    e.preventDefault();
                    e.stopPropagation();
                }

                $document.on('keydown', shortcut);

                $scope.$on('$destroy', function() {
                    $document.off('keydown', shortcut)
                });
            }

        };
    });