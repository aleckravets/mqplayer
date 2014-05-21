'use strict';

angular.module('Player', ['ui.slider'])
    .factory('Player', function($q, Record) {

        function Ctor(playlist) {
            this.playlist = playlist.records;
            this.selectedRecords = playlist.selectedRecords;

            var self = this;
            this.audio.addEventListener('ended', function() {
                self.next(true);
            });
        }

        Ctor.prototype = {
            audio: new Audio(),
            currentRecord: undefined,
            repeat: false,
            random: false,
            playRecord: function(record) {
                this.audio.src = record.node.item.url;
                this.audio.play();
                this.currentRecord = record;
            },
            isSupportedItem: function(item) {
                return /\.mp3/.test(item.name);
            },
            playNode: function(node) {
                this.stop();
                this.playlist.empty();
                this.currentRecord = undefined;

//                this.state.loading = true;

                var self = this;

                this.getPlayableNodes(node).then(function(nodes) {
                    nodes.forEach(function(node) {
                        self.playlist.push(new Record(node));
                    });

                    if (self.playlist.length > 0)
                        self.playRecord(self.playlist[0]);

//                    self.state.loading = false;
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
//                this.state.loading = true;

                var self = this;

                this.getPlayableNodes(node).then(function(nodes) {
                    if (insertBeforeRecord) {
                        var index = this.playlist.indexOf(insertBeforeRecord);
                        nodes.forEach(function(node){
                            self.playlist.splice(index++, 0, new Record(node));
                        });
                    }
                    else {
                        nodes.forEach(function(node){
                            self.playlist.push(new Record(node));
                        });
                    }

//                    self.state.loading = false;
                });
            },
            prev: function() {
                var i = this.playlist.indexOf(this.currentRecord);
                if (i - 1 >= 0)
                    this.playRecord(this.playlist[i - 1]);
            },
            next: function(auto) {
                if (this.random) {
                    var next = Math.floor(Math.random() * this.playlist.length);
                    this.playRecord(this.playlist[next]);
                } else {
                    var i = this.playlist.indexOf(this.currentRecord);
                    if (i <= this.playlist.length - 2) {
                        this.playRecord(this.playlist[i + 1]);
                    }
                    else if (i == this.playlist.length - 1) {
                        if (this.repeat) {
                            this.playRecord(this.playlist[0]);
                        }
                        else if (auto) {
                            this.stop();
                        }
                    }
                }
            },
            stop: function() {
                this.audio.pause();
                this.audio.src = '';
                this.currentRecord = null;
            },
            mute: function() {
                this.audio.muted = !this.audio.muted;
            },
            toggleRandom: function() {
                this.random = !this.random;
            },
            toggleRepeat: function() {
                this.repeat = !this.repeat;
            },
            playPause: function() {
                if (this.audio.paused) {
                    if (this.currentRecord) {
                        this.audio.play()
                    }
                    else if (this.selectedRecords.length > 0) {
                        this.playRecord(this.selectedRecords[this.selectedRecords.length - 1]);
                    }
                    else if (this.playlist) {
                        this.playRecord(this.playlist[0]);
                    }
                }
                else {
                    this.audio.pause();
                }
            }
        };

        return Ctor;
    });
