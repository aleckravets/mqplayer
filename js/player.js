'use strict';

angular.module('Player', [])
    .directive('player', ['Player', function(Player) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;

                $scope.select = function($event, item) {
                    if (Player.state.selectedItem)
                        Player.state.selectedItem.selected2 = false;

                    Player.state.selectedItem = item;

                    item.selected2 = true;
                };

                Player.audio.addEventListener('ended', function() {
                    $scope.$apply();
                });

                Player.audio.volume = 0.5;
            },
            templateUrl: 'player.html'
        };
    }])
    .directive('droppablePlaylist', ['Player', function(Player) {
        return {
            link: function(scope, element, attrs) {
                element.on('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element.on('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.dragover = true;
                    });
                });

                element.on('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.dragover = false;
                    });
                });

                element.on('drop', function(e) {
                    scope.$apply(function() {
                        scope.dragover = false;
                    });

                    Player.enqueue(Player.dragging);
                });
            }
        }
    }])
    .directive('droppableItem', ['Player', function(Player) {
        return {
            link: function(scope, element, attrs) {
                element.on('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element.on('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.item.dragover = true;
                    });
                });

                element.on('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.item.dragover = false;
                    });
                });

                element.on('drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    Player.enqueue(Player.dragging, scope.item);

                    scope.item.dragover = false;
                    scope.$apply();
                });
            }
        }
    }])
    .factory('Player', ['$q', function($q) {
        var audio = new Audio();
        var playlist = [];
        var state = {};

        var player = {
            audio: audio,
            playlist: playlist,
            state: state,
            playItem: function(item) {
                audio.src = item.getUrl();
                audio.play();
                state.currentItem = item;
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
                delete this.state.currentItem;

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
                var i = playlist.indexOf(state.currentItem);
                if (i - 1 >= 0)
                    this.playItem(playlist[i - 1]);
            },
            next: function() {
                var i = playlist.indexOf(state.currentItem);
                if (i + 2 <= playlist.length)
                    this.playItem(playlist[i + 1]);
            },
            stop: function() {
                audio.pause();
                audio.src = '';
                state.currentItem = null;
            },
            playPause: function() {
                if (audio.paused) {
                    if (state.currentItem) {
                        audio.play()
                    }
                    else if (state.selectedItem) {
                        this.playItem(state.selectedItem);
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