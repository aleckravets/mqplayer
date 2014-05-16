'use strict';

angular.module('Player', ['ui.slider'])
    .directive('player', ['Player', '$document', function(Player, $document) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;

                var state = {
                    selectedRecords: [],
                    lastClickedRecord: undefined
                };

                $scope.mousedown = function(e, record) {
                    if (e.shiftKey) {
                        if (state.lastClickedRecord && state.lastClickedRecord.selected != record.selected) {
                            var i1 = $scope.player.playlist.indexOf(state.lastClickedRecord);
                            var i2 = $scope.player.playlist.indexOf(record);
                            var first = i1 < i2 ? i1 + 1 : i2;
                            var last = i1 < i2 ? i2 : i1 - 1;
                            for (var i = first; i <= last; i++) {
                                $scope.player.playlist[i].selected = state.lastClickedRecord.selected;
                                state.selectedRecords.push($scope.player.playlist[i]);
                            }
                        }
                    }
                    else if (e.ctrlKey) {
                        if (!record.selected) {
                            state.selectedRecords.push(record);
                        }
                        else {
                            var i = state.selectedRecords.indexOf(record);
                            state.selectedRecords.splice(i, 1);
                        }

                        record.selected = !record.selected;
                    }
                    else {
                        state.selectedRecords.forEach(function(record) {
                            record.selected = false;
                        });
                        state.selectedRecords.empty();

                        record.selected = !record.selected;

                        if (record.selected)
                            state.selectedRecords.push(record);
                    }

                    state.lastClickedRecord = record;

                    e.preventDefault(); // no selection on double click
                };

                $scope.deleteSelected = function() {
                    if (state.selectedRecords.length == $scope.player.playlist.length) {
                        $scope.player.playlist.empty();
                    }
                    else {
                        state.selectedRecords.forEach(function(record) {
                            var i = $scope.player.playlist.indexOf(record);
                            $scope.player.playlist.splice(i, 1);
                        });
                    }
                    state.selectedRecords.empty();
                };

                $scope.selectAll = function() {
                    state.selectedRecords.empty();
                    $scope.player.playlist.forEach(function(record) {
                        record.selected = true;
                        state.selectedRecords.push(record);
                    });
                };

                $document.on('keydown', function(e) {
                    switch (e.key.toLowerCase()) {
                        case 'del':
                            $scope.deleteSelected();
                            $scope.$apply();
                            break;
                        case 'a':
                            if (e.ctrlKey) {
                                e.preventDefault();
                                $scope.selectAll();
                                $scope.$apply();
                            }
                            break;
                        default:
                            break;
                    }
                });

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
            isSupportedItem: function(item) {
                return /\.mp3/.test(item.name);
            },
            playNode: function(node) {
                this.stop();
                playlist.empty();
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