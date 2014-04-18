'use strict';

angular.module('Player', [])
    .directive('player', ['$rootScope', 'Player', function($rootScope, Player) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;

                $scope.playpause = function() {
                    if ($scope.audio.paused) {
                        if (!$scope.items)
                            return;

                        if (!$scope.currentItem) {
                            $scope.currentItem = $scope.items[0];
                            $scope.audio.src = 'proxy.php?get=' + $scope.currentItem.href;
                        }

                        $scope.audio.play();
                    }
                    else {
                        $scope.audio.pause();
                    }
                };

                $scope.stop = function() {
                    $scope.audio.pause();
                    $scope.src = '';
                }
            },

            templateUrl: 'player.html'
        };
    }])
    .factory('Player', ['DiskAPI', '$q', function(DiskAPI, $q) {
        var audio = new Audio();
        var playlist = [];

        var playFile = function(item) {
            audio.src = item.getUrl();
            audio.play();
            audio.currentItem = item;
        };

        var clearPlaylist = function() {
            playlist.splice(0, playlist.length);
        }

        var isSupportedType = function(item) {
            return /\.mp3/.test(item.href);
        };

        audio.addEventListener('ended', function() {
            next();
        });

        return {
            audio: audio,
            playlist: playlist,
            next: function() {
                var i = playlist.indexOf(audio.currentItem);
                if (i + 2 <= playlist.length) {
                    var item = playlist[i + 1]
                    audio.src = item.getUrl();
                    audio.play();
                    audio.currentItem = item;
                }
            },
            stop: function() {
                audio.pause();
                audio.src = '';
            },
            playItem: function(item) {
                this.stop();
                clearPlaylist();

                if (item.isDir()) {
                    item.getChildren().then(function(items) {
                        for (var i = 0; i < items.length; i++) {
                            if (isSupportedType(items[i])) {
                                playlist.push(items[i]);
                            }
                        }
                    });

                }
                else {
                    if (isSupportedType(item))
                        playlist.push(item);
                }

                if (playlist.length == 0)
                    return;

                playFile(playlist[0]);
            }
        };
    }]);