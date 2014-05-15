'use strict';

angular.module('Player', ['ui.slider'])
    .directive('player', ['Player', function(Player) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;
                $scope.selectedRecords = [];

                $scope.mousedown = function($event, record) {
                    if ($event.shiftKey) {

                    } else {
                        if ($scope.selectedRecords.length > 0 && !$event.ctrlKey) {
                            $scope.selectedRecords.forEach(function(record) {
                                record.selected = false;
                            });
                        }

                        Player.state.selectedRecord = record;

                        record.selected = !record.selected;

                        $scope.selectedRecords.push(record);
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

                    Player.enqueue(Player.draggedNode);
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
                        scope.record.dragover = true;
                    });
                });

                element[0].addEventListener('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.record.dragover = false;
                    });
                });

                element[0].addEventListener('drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    Player.enqueue(Player.draggedNode, scope.record);

                    scope.record.dragover = false;
                    scope.$apply();
                });
            }
        }
    }])
    .factory('Player', ['$q', 'Record', function($q, Record) {
        var audio = new Audio();
        var playlist = [];
        var state = {
            currentRecord: undefined,
            repeat: false,
            random: false
        };

        var player = {
            audio: audio,
            playlist: playlist,
            state: state,
            playRecord: function(record) {
                audio.src = record.node.item.url;
                audio.play();
                state.currentRecord = record;
            },
            clearPlaylist: function() {
                playlist.splice(0, playlist.length);
            },
            isSupportedItem: function(item) {
                return /\.mp3/.test(item.name);
            },
            playNode: function(node) {
                this.stop();
                this.clearPlaylist();
                delete this.state.currentRecord;

                this.state.loading = true;

                var self = this;

                this.getPlayableNodes(node).then(function(nodes) {
                    nodes.forEach(function(node) {
                        playlist.push(new Record(node));
                    });

                    if (playlist.length > 0)
                        self.playRecord(playlist[0]);

                    self.state.loading = false;
                });
            },
            getPlayableNodes: function(node) {
                var self = this;
                return $q.when(node.item.isDir ? node.getAllChildren(): [node]).then(function(nodes) {
                    var playable = [];
                    nodes.forEach(function(node) {
                        if (!node.item.isDir && self.isSupportedItem(node.item))
                            playable.push(node);
                    });

                    return playable;
                });
            },
            enqueue: function(node, insertBeforeRecord) {
                this.state.loading = true;

                var self = this;

                this.getPlayableNodes(node).then(function(nodes) {
                    if (insertBeforeRecord) {
                        var index = playlist.indexOf(insertBeforeRecord);
                        nodes.forEach(function(node){
                            playlist.splice(index++, 0, new Record(node));
                        });
                    }
                    else {
                        nodes.forEach(function(node){
                            playlist.push(new Record(node));
                        });
                    }

                    self.state.loading = false;
                });
            },
            prev: function() {
                var i = playlist.indexOf(state.currentRecord);
                if (i - 1 >= 0)
                    this.playRecord(playlist[i - 1]);
            },
            next: function() {
                if (state.random) {
                    var next = Math.floor(Math.random() * playlist.length);
                    this.playRecord(playlist[next]);
                } else {
                    var i = playlist.indexOf(state.currentRecord);
                    if (i <= playlist.length - 2)
                        this.playRecord(playlist[i + 1]);
                    else if (i == playlist.length - 1 && state.repeat)
                        this.playRecord(playlist[0]);
                }
            },
            stop: function() {
                audio.pause();
                audio.src = '';
                state.currentRecord = null;
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
                    if (state.currentRecord) {
                        audio.play()
                    }
                    else if (state.selectedRecord) {
                        this.playRecord(state.selectedRecord);
                    }
                    else if (playlist) {
                        this.playRecord(playlist[0]);
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
    }])
    .factory('Record', [function() {
        function Ctor(node) {
            this.node = node;
        }

        Ctor.prototype = {
            selected: false
        };

        return Ctor;
    }]);