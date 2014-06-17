'use strict';

angular.module('services')
    .factory('helper', function($q, Record, dataService, session) {
        var that = { };

        /**
         * Converts a single Item to a Record.
         * @param {Item} item
         * @returns {Record}
         */
        function recordFromItem(item) {
            return new Record(item.name, item.url);
        }

        /**
         * Recursively loads the children items and returns them as a flat array.
         * @param {string} parentid
         * @returns {Promise<Item[]>}
         */
        function getAllItems(parentid) {
            return dataService.getItemsByParent(parentid).then(function(items) {
                var children = [];
                var dirs = [];

                items.forEach(function(item) {
                    children.push(item);
                    if (item.isDir) {
                        dirs.push(item);
                    }
                });

                var result = $q.when(children);

                dirs.forEach(function(item) {
                    result = result.then(function() {
                        return getAllItems(item.id).then(function(items) {
                            // apply is used since then number of arguments for splice is dynamic
                            Array.prototype.splice.apply(children, [children.indexOf(item), 1].concat(items));
                            return children;
                        });
                    });
                });

                return result;
            });
        }

        /**
         * Checks whether provided file's type is supported by looking at its extension.
         * @param {string} name A file's name.
         * @returns {boolean}
         */
        that.isSupportedType = function(name) {
            return (/\.mp3/).test(name);
        };

        /**
         * Returns array of Records by specified Item. If item is a directory - returns all its children recursively,
         * otherwise - returns only item itself.
         * @param {TreeNode} item An item to get the records from.
         * @returns {Promise<Record[]>}
         */
        that.getItemRecords = function(item) {
            return (item.isDir ? getAllItems(item.id) : $q.when([item])).then(function(items) {
                var records = [];
                items.forEach(function(item) {
                    if (!item.isDir && that.isSupportedType(item.name)) {
                        records.push(recordFromItem(item));
                    }
                });

                return records;
            });
        };

        /**
         * Returns all child Records by specified item ids as a flat array ready to be used by playlist.
         * @param {string[]} ids Item ids to get the records for.
         * @returns {Promise<Record[]>}
         */
        that.getRecordsByItemIds = function(ids) {
            return dataService.getItemById(ids[0]).then(function(item) {
                if (ids.length === 1) {
                    return that.getItemRecords(item);
                }

                return dataService.getItemsByParent(item.parentid).then(function(siblings) {
                    var items = [];

                    siblings.forEach(function(item) {
                        if (ids.indexOf(item.id) !== -1) {
                            items.push(item);
                        }
                    });

                    var records = [];

                    var result = $q.when(records);

                    items.forEach(function(item) {
                        result = result.then(function() {
                            return that.getItemRecords(item).then(function(itemRecords) {
                                records.pushArray(itemRecords);
                                return records;
                            });
                        });
                    });

                    return result;
                });
            });
        };

        /**
         * Parses the "state" query parameter passed by Google Drive on "Open with..." and plays the specified files.
         */
        that.checkState = function() {
            var st = getParameterByName('state');

//        st = "%7B%22ids%22%3A%5B%220B9OzzXRNwUnXVnRxU2kzQTdsUm8%22%2C%220B9OzzXRNwUnXdEpyOVJNUkxwcDg%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22103354693083460731603%22%7D";

            if (st) {
                var state = angular.fromJson(decodeURI(st));

//            // debug
//            state = {
//                "ids": [
//                    "0B9OzzXRNwUnXVnRxU2kzQTdsUm8",
//                    "0B9OzzXRNwUnXdEpyOVJNUkxwcDg"
//                ],
//                "action": "open",
//                "userId": "103354693083460731603"
//            };

                if (state.ids && state.ids.length > 0) {
                    session.playlist.set(that.getRecordsByItemIds(state.ids)).then(function(records) {
                        if (records.length > 0) {
                            session.player.playRecord(records[0]);
                        }
                    });
                }
            }
        };

        return that;
    });