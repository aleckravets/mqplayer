'use strict';

angular.module('types')
    .factory('Playlist', function(Record) {
        function Ctor() {
            this.repeat =  false;
            this.random = false;
            this.records = [];
            this.selectedRecords = [];
            this.loading = false;
        }

        Ctor.prototype = {
            /**
             * Adds one or multiple records to the playlist.
             * @param {Promise<Record[]>} recordsPromise A promise that resolves to an array of records to enqueue.
             * @param {Record} [insertBeforeRecord] A record in the playlist before which the new records should be.
             * inserted, if omitted - the records are inserted at the end.
             * @returns {Promise<Record[]} a promise resolved to the array of records that are currently in the playlist
             * when done.
             */
            enqueue: function(recordsPromise, insertBeforeRecord) {
                this.loading = true;

                var self = this,
                    index = insertBeforeRecord ? this.records.indexOf(insertBeforeRecord) : this.records.length;

                return recordsPromise.then(function(records) {
                    records.forEach(function (record) {
                        //if (!record.node.item.isDir && !self.isSupportedRecord(record)) return;
                        self.records.splice(index++, 0, record);
                    });
                    self.loading = false;

                    return self.records;
                });
            },

            /**
             * Clears the playlist and enqueues passed record(s).
             * @param {Promise<Record[]>} recordsPromise A promise that resolves to an array of records to enqueue.
             * @returns {Promise<Record[]} a promise resolved to the array of records that are currently in the playlist
             * when done.
             */
            set: function(recordsPromise) {
                this.clear();
                return this.enqueue(recordsPromise);
            },

            /**
             * Clears the playlist
             */
            clear: function() {
                this.records.empty();
                this.selectedRecords.empty();
            },

            /**
             * Returns the record preceding the passed one
             * @param {Record} record
             * @param {Boolean} [random=this.random]
             * @param {Boolean} [repeat=this.repeat]
             * @returns {Record|false} The previous record or false.
             */
            prev: function(record, random, repeat) {
                var i;
                if (random === undefined ? this.random : random) {
                    i = Math.floor(Math.random() * this.records.length);
                    return this.records[i];
                } else {
                    i = this.records.indexOf(record);
                    if (i > 0) {
                        return this.records[i - 1];
                    }
                    else if (i === 0 && (repeat === undefined ? this.repeat : repeat)) {
                        return this.records[this.records.length - 1];
                    }
                }
                return false;
            },

            /**
             * Returns the record following the passed one
             * @param {Record} record
             * @param {Boolean} [random=this.random]
             * @param {Boolean} [repeat=this.repeat]
             * @returns {Record|false} The next record or false.
             */
            next: function(record, random, repeat) {
                var i;
                if (random === undefined ? this.random : random) {
                    i = Math.floor(Math.random() * this.records.length);
                    return this.records[i];
                } else {
                    i = this.records.indexOf(record);
                    if (i <= this.records.length - 2) {
                        return this.records[i + 1];
                    }
                    else if (i === this.records.length - 1 && (repeat === undefined ? this.repeat : repeat)) {
                        return this.records[0];
                    }
                }
                return false;
            },

            /**
             * Toggles the boolean value of "random" property
             */
            toggleRandom: function() {
                this.random = !this.random;
            },

            /**
             * Toggles the boolean value of "repeat" property
             */
            toggleRepeat: function() {
                this.repeat = !this.repeat;
            }
        };

        return Ctor;
    });