'use strict';

angular.module('Player', ['Directives'])
    .directive('player', ['$rootScope', 'Player', function($rootScope, Player) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;
                $scope.audio = Player.audio;
                $scope.playlist = Player.playlist;
                $scope.currentItem = null;

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
    .factory('Player', ['DiskAPI', function(DiskAPI) {
        var playlist = [];
        var audio = new Audio();
        var currentItem = {};

        var next = function() {
            var i = playlist.indexOf(currentItem);
            if (i + 2 <= playlist.length) {
                currentItem = playlist[i + 1];
                audio.src = DiskAPI.getFileUrl(currentItem.href);
                audio.play();
            }
        };

        var playItem = function(item) {
            audio.src = '';
            playlist.splice(0, playlist.length);

            if (item.resourceType == 'dir') {
                for (var i = 0; i < item.children.length; i++) {
                    if (/\.mp3/.test(item.children[i].href)) {
                        playlist.push(item.children[i]);
                    }
                }
            }
            else {
                playlist.push(item);
            }

            if (playlist.length == 0)
                return;

            currentItem = playlist[0];
            audio.src = DiskAPI.getFileUrl(currentItem.href);
            audio.play();
        };

        audio.addEventListener('ended', function() {
            next();
        });

        return {
            audio: audio,
            playlist: playlist,
            currentItem: currentItem,
            next: next,
            play: function(item) {
                if (item.resourceType == 'dir' && item.children == undefined) {
                    DiskAPI.getItems(item.href, function(data) {
                        item.children = data;
                        playItem(item);
                    });
                }
                else {
                    playItem(item);
                }
            }
        };
    }]);