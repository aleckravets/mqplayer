'use strict';

angular.module('Player', ['ui.slider'])
    .factory('Player', function($q, Record, State) {
        var audio = new Audio();
        var playlist = [];
        var state = {
            currentRecord: undefined,
            repeat: false,
            random: false
        };

        var player = {
            audio: audio,
            playlist: playlist, // todo: move playlist to session
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
            next: function(auto) {
                if (state.random) {
                    var next = Math.floor(Math.random() * playlist.length);
                    this.playRecord(playlist[next]);
                } else {
                    var i = playlist.indexOf(state.currentRecord);
                    if (i <= playlist.length - 2) {
                        this.playRecord(playlist[i + 1]);
                    }
                    else if (i == playlist.length - 1) {
                        if (state.repeat) {
                            this.playRecord(playlist[0]);
                        }
                        else if (auto) {
                            this.stop();
                        }
                    }
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
                    else if (State.selectedRecords.length > 0) {
                        this.playRecord(State.selectedRecords[State.selectedRecords.length - 1]);
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
            player.next(true);
        });

        return player;
    })
    .factory('Record', [function() {
        function Ctor(node) {
            this.node = node;
        }

        Ctor.prototype = {
            selected: false
        };

        return Ctor;
    }]);