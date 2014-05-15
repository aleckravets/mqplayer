'use strict';

angular.module('Player', ['ui.slider'])
    .directive('player', ['Player', function(Player) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;
                $scope.selectedItems = [];

                $scope.mousedown = function($event, item) {
                    if ($event.shiftKey) {

                    } else {
                        if ($scope.selectedItems.length > 0 && !$event.ctrlKey) {
                            $scope.selectedItems.forEach(function(item) {
                                item.selected2 = false;
                            });
                        }

                        Player.state.selectedItem = item;

                        item.selected2 = !item.selected2;

                        $scope.selectedItems.push(item);
                    }
                    $event.preventDefault(); // no selection on double click
                };

                Player.audio.addEventListener('ended', function() {
                    $scope.$apply();
                });

                Player.audio.addEventListener('timeupdate', function() {
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
                element[0].addEventListener('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element[0].addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.dragover = true;
                    });
                });

                element[0].addEventListener('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.dragover = false;
                    });
                });

                element[0].addEventListener('drop', function(e) {
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
                element[0].addEventListener('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element[0].addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.item.dragover = true;
                    });
                });

                element[0].addEventListener('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.item.dragover = false;
                    });
                });

                element[0].addEventListener('drop', function(e) {
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
        var state = {
            currentItem: undefined,
            repeat: false,
            random: false
        };

        var player = {
            audio: audio,
            playlist: playlist,
            state: state,
            playItem: function(item) {
                audio.src = item.url;
                audio.play();
                state.currentItem = item;
            },
            clearPlaylist: function() {
                playlist.splice(0, playlist.length);
            },
            isSupportedType: function(item) {
                return /\.mp3/.test(item.displayName);
            },
            play: function(item) {
                this.stop();
                this.clearPlaylist();
                delete this.state.currentItem;

                this.state.loading = true;

                var th = this;

                this.getPlayableItems(item).then(function(items) {
                    items.forEach(function(item) {
                        playlist.push(item);
                    });

                    if (playlist.length > 0)
                        th.playItem(playlist[0]);

                    th.state.loading = false;
                });
            },
            getPlayableItems: function(item) {
                var th = this;
                return $q.when(item.isDir() ? this.getAllChildren(item): [item]).then(function(items) {
                    var playable = [];
                    items.forEach(function(item) {
                        if (!item.isDir() && th.isSupportedType(item))
                            playable.push(item);
                    });

                    return playable;
                });
            },
            // get directory children recursively
            getAllChildren: function(item) {
                var th = this;
                return item.getChildren().then(function(items) {
                    var children = [];
                    var dirs = [];

                    items.forEach(function(item, index) {
                        if (!item.isDir() && !th.isSupportedType(item)) return;

                        children.push(item);

                        if (item.isDir())
                            dirs.push(item);
                    });

                    var result = $q.when(children);

                    dirs.forEach(function(dir) {
                        result = result.then(function() {
                            return th.getAllChildren(dir).then(function(items) {
                                Array.prototype.splice.apply(children, [children.indexOf(dir), 1].concat(items));
                                return children;
                            });
                        });
                    });

                    return result;
                });
            },
            enqueue: function(item, insertBeforeItem) {
                this.state.loading = true;

                var th = this;

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

                    th.state.loading = false;
                });
            },
            prev: function() {
                var i = playlist.indexOf(state.currentItem);
                if (i - 1 >= 0)
                    this.playItem(playlist[i - 1]);
            },
            next: function() {
                if (state.random) {
                    var next = Math.floor(Math.random() * playlist.length);
                    this.playItem(playlist[next]);
                } else {
                    var i = playlist.indexOf(state.currentItem);
                    if (i <= playlist.length - 2)
                        this.playItem(playlist[i + 1]);
                    else if (i == playlist.length - 1 && state.repeat)
                        this.playItem(playlist[0]);
                }
            },
            stop: function() {
                audio.pause();
                audio.src = '';
                state.currentItem = null;
            },
            mute: function() {
                audio.muted = !audio.muted;
            },
            random: function() {
                state.random = !state.random;
            },
            repeat: function() {
                state.repeat = !state.repeat;
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