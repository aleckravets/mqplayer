'use strict';

angular.module('Player', [])
    .directive('player', ['Player', function(Player) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;

                $scope.select = function($event, item) {
                    if ($scope.selectedItem)
                        $scope.selectedItem.selected2 = false;

                    $scope.selectedItem = item;

                    item.selected2 = true;
                };

                Player.audio.addEventListener('ended', function() {
                    $scope.$apply();
                });
            },
            templateUrl: 'player.html'
        };
    }])
    .directive('droppable', ['Player', 'TreeState', function(Player, TreeState) {
        return {
            link: function(scope, element, attrs) {
                element.on('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element.on('dragenter', function(e) {
                    scope.$apply(function(){
                        scope.item.dragover = true;
                    });
                });

                element.on('dragleave', function(e) {
                    scope.item.dragover = false;
                });

                element.on('drop', function(e) {
                    scope.item.dragover = false;
                    Player.enqueue(TreeState.dragging, scope.item);
                });
            }
        }
    }])
    .factory('Player', ['$q', function($q) {
        var audio = new Audio();
        var playlist = [];

        var player = {
            audio: audio,
            playlist: playlist,
            playItem: function(item) {
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
            play: function(item) {
                this.stop();
                this.clearPlaylist();

                var th = this;

                this.getPlayableItems(item).then(function(items) {
                    items.forEach(function(item) {
                        playlist.push(item);
                    });

                    if (playlist.length > 0)
                        th.playItem(playlist[0]);
                });
            },
            getPlayableItems: function(item) {
                var th = this;
                return $q.when(item.isDir() ? item.getChildren() : [item]).then(function(items) {
                    var playable = [];
                    items.forEach(function(item) {
                        if (!item.isDir() && th.isSupportedType(item))
                            playable.push(item);
                    });

                    return playable;
                });
            },
            enqueue: function(item, insertBeforeItem) {
                this.getPlayableItems(item).then(function(items) {
                    if (insertBeforeItem) {
                        var index = playlist.indexOf(insertBeforeItem);
                        items.forEach(function(item){
                            playlist.splice(index++, 0, item);
                        });
                    }
                    else {
                        items.forEach(function(item){
                            playlist.push(item);
                        });
                    }
                });
            },
            prev: function() {
                var i = playlist.indexOf(audio.currentItem);
                if (i - 1 >= 0)
                    this.playItem(playlist[i - 1]);
            },
            next: function() {
                var i = playlist.indexOf(audio.currentItem);
                if (i + 2 <= playlist.length)
                    this.playItem(playlist[i + 1]);
            },
            stop: function() {
                audio.pause();
                audio.src = '';
                audio.currentItem = null;
            },
            playPause: function() {
                if (audio.paused) {
                    if (audio.currentItem) {
                        audio.playItem()
                    }
                    else if (playlist) {
                        this.playItem(playlist[0]);
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
    }]);