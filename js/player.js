'use strict';

angular.module('Player', [])
    .directive('player', ['Player', function(Player) {
        return {
            restrict: 'E',
            scope: { },
            controller: function($scope, $element) {
                $scope.player = Player;

                $scope.select = function($event, item) {
                    if ($scope.selectedItem)
                        $scope.selectedItem.selected = false;

                    $scope.selectedItem = item;

                    item.selected = true;
                };

                Player.audio.addEventListener('ended', function() {
                    $scope.$apply();
                });
            },
            templateUrl: 'player.html'
        };
    }])
    .factory('Player', function() {
        var audio = new Audio();
        var playlist = [];

        var player = {
            audio: audio,
            playlist: playlist,
            play: function(item) {
                audio.src = item.getUrl();
                audio.play();
                audio.currentItem = item;
            },
            clearPlaylist: function() {
                playlist.splice(0, playlist.length);
            },
            isSupportedType: function(item) {
                return /\.mp3/.test(item.href);
            },
            prev: function() {
                var i = playlist.indexOf(audio.currentItem);
                if (i - 1 >= 0)
                    this.play(playlist[i - 1]);
            },
            next: function() {
                var i = playlist.indexOf(audio.currentItem);
                if (i + 2 <= playlist.length)
                    this.play(playlist[i + 1]);
            },
            stop: function() {
                audio.pause();
                audio.src = '';
                audio.currentItem = null;
            },
            setAndPlay: function(item) {
                this.stop();
                this.clearPlaylist();

                if (item.isDir()) {
                    var th = this;
                    item.getChildren().then(function(items) {
                        for (var i = 0; i < items.length; i++) {
                            if (th.isSupportedType(items[i])) {
                                playlist.push(items[i]);
                            }
                        }

                        if (playlist.length > 0)
                            th.play(playlist[0]);
                    });
                }
                else {
                    if (this.isSupportedType(item))
                        playlist.push(item);

                    this.play(item);
                }
            },
            playPause: function() {
                if (audio.paused) {
                    if (audio.currentItem) {
                        audio.play()
                    }
                    else if (playlist) {
                        this.play(playlist[0]);
                    }
                }
                else {
                    audio.pause();
                }
            }
        };

        audio.addEventListener('ended', function() {
            player.next();
        });

        return player;
    });