'use strict';

angular.module('App')
    .factory('Playlist', function($q, Record) {
        function Ctor() {
            this.repeat =  false;
            this.random = false;
            this.records = [];
            this.selectedRecords = [];
            this.loading = false;
        }

        Ctor.prototype = {
            getPlayableNodes: function(node) {
                this.loading = true;
                var self = this;
                return $q.when(node.item.isDir ? node.getAllChildren(): [node]).then(function(nodes) {
                    var playable = [];
                    nodes.forEach(function(node) {
                        if (!node.item.isDir && self.isSupportedItem(node.item))
                            playable.push(node);
                    });

                    self.loading = false;

                    return playable;
                });
            },
            enqueue: function(node, insertBeforeRecord) {
                var self = this;

                return this.getPlayableNodes(node).then(function(nodes) {
                    if (insertBeforeRecord) {
                        var index = self.records.indexOf(insertBeforeRecord);
                        nodes.forEach(function(node){
                            self.records.splice(index++, 0, new Record(node));
                        });
                    }
                    else {
                        nodes.forEach(function(node){
                            self.records.push(new Record(node));
                        });
                    }

                    return self.records;
                });
            },
            set: function(node) {
                this.records.empty();
                this.selectedRecords.empty();
                return this.enqueue(node);
            },
            prev: function(record, random, repeat) {
                if (random === undefined ? this.random : random) {
                    var i = Math.floor(Math.random() * this.records.length);
                    return this.records[i];
                } else {
                    var i = this.records.indexOf(record);
                    if (i > 0) {
                        return this.records[i - 1];
                    }
                    else if (i == 0 && (repeat === undefined ? this.repeat : repeat)) {
                        return this.records[this.records.length - 1];
                    }
                }
                return false;
            },
            next: function(record, random, repeat) {
                if (random === undefined ? this.random : random) {
                    var i = Math.floor(Math.random() * this.records.length);
                    return this.records[i];
                } else {
                    var i = this.records.indexOf(record);
                    if (i <= this.records.length - 2) {
                        return this.records[i + 1];
                    }
                    else if (i == this.records.length - 1 && (repeat === undefined ? this.repeat : repeat)) {
                        return this.records[0];
                    }
                }
                return false;
            },
            toggleRandom: function() {
                this.random = !this.random;
            },
            toggleRepeat: function() {
                this.repeat = !this.repeat;
            },
            isSupportedItem: function(item) {
                return /\.mp3/.test(item.name);
            }
        };

        return Ctor;
    });