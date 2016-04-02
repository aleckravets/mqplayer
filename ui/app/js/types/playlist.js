'use strict';

angular.module('types')
    .factory('Playlist', function(Record, $q) {
        function Ctor() {
            this.repeat =  false;
            this.random = false;
            this.records = [];
            this.shuffledRecords = [];
            this.selectedRecords = [];
            this.loading = false;
        }

        Ctor.prototype = {
            /**
             * Adds one or multiple records to the playlist.
             * @param {Promise<Record[]>|Record[]} records Records to enqueue.
             * @param {Record} [insertBeforeRecord] A record in the playlist before which the new records should be
             * inserted, if omitted - the records are inserted at the end.
             * @returns {Promise<Record[]} the whole playlist when enqueue is done.
             */
            enqueue: function(records, insertBeforeRecord) {
                this.loading = true;

                var self = this,
                    index = insertBeforeRecord ? this.records.indexOf(insertBeforeRecord) : this.records.length;

                return $q.when(records)
                    .then(function(recs) {
                        recs.forEach(function (record) {
                            self.records.splice(index++, 0, record);
                        });

                        self.shuffle();

                        return self.records;
                    })
                    .finally(function() {
                        self.loading = false;
                    });
            },

            /**
             * Clears the playlist and enqueues passed record(s).
             * @param {Promise<Record[]>} records records to enqueue.
             * @returns {Promise<Record[]} the whole playlist when enqueue is done.
             */
            set: function(records) {
                this.clear();
                return this.enqueue(records);
            },

            /**
             * Clears the playlist
             */
            clear: function() {
                this.records.empty();
                this.selectedRecords.empty();
                this.shuffle();
            },

            removeSelected: function() {
                var self = this;
                if (this.selectedRecords.length == this.records.length) {
                    this.records.empty();
                }
                else {
                    this.selectedRecords.forEach(function(record) {
                        var i = self.records.indexOf(record);
                        self.records.splice(i, 1);
                    });
                }
                this.selectedRecords.empty();
                this.shuffle();
            },

            /**
             * Returns the record preceding the passed one
             * @param {Record} record
             * @param {Boolean} [random=this.random]
             * @param {Boolean} [repeat=this.repeat]
             * @returns {Record | Boolean} The previous record or false.
             */
            prev: function(record, random, repeat) {
                var records =  (random === undefined ? this.random : random) ? this.shuffledRecords : this.records;
                var i = records.indexOf(record);

                if (i > 0) {
                    return records[i - 1];
                }
                else if (i === 0 && (repeat === undefined ? this.repeat : repeat)) {
                    return records[records.length - 1];
                }

                return false;
            },

            /**
             * Returns the record following the passed one
             * @param {Record} record
             * @param {Boolean} [random=this.random]
             * @param {Boolean} [repeat=this.repeat]
             * @returns {Record|Boolean} The next record or false.
             */
            next: function(record, random, repeat) {
                var records =  (random === undefined ? this.random : random) ? this.shuffledRecords : this.records;
                var i = records.indexOf(record);


                if (i <= records.length - 2) {
                    return records[i + 1];
                }

                if (i === records.length - 1 && (repeat === undefined ? this.repeat : repeat)) {
                    return records[0];
                }

                return false;
            },

            /**
             * Toggles the boolean value of "random" property
             */
            toggleRandom: function() {
                this.random = !this.random;
                if (this.currentRecord) {
                    this.rotateShuffledRecords(this.currentRecord);
                }
            },

            /**
             * Toggles the boolean value of "repeat" property
             */
            toggleRepeat: function() {
                this.repeat = !this.repeat;
            },

            selectAll: function() {
                var self = this;
                this.selectedRecords.empty();
                this.records.forEach(function(record) {
                    record.selected = true;
                    self.selectedRecords.push(record);
                });
            },

            //removeSelected: function() {
            //
            //},

            move: function(movedRecords, insertBefore) {
                var $this = this;

                if (!insertBefore || movedRecords.indexOf(insertBefore) === -1) { // if target is not among the movedRecords records
                    movedRecords.forEach(function(record) {
                        $this.records.splice($this.records.indexOf(record), 1);
                    });

                    $this.records.spliceArray(insertBefore ? $this.records.indexOf(insertBefore) : $this.records.length, 0, movedRecords);
                }

                //this.shuffle();
            },

            shuffle: function() {
                this.shuffledRecords = this.records
                    .clone()
                    .shuffle();
            },

            rotateShuffledRecords: function(firstRecord) {
                this.shuffledRecords.rotate(this.shuffledRecords.indexOf(firstRecord));
            },

            /**
             * Returns the records in the right order depending on the "shuffle" state.
             * @returns {*}
             */
            getRecords: function() {
                return this.random ? this.shuffledRecords : this.records;
            }
        };

        return Ctor;
    });