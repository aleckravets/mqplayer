'use strict';

angular.module('services')
    .factory('helper', function($q, Record, dataService) {
        var that = {
        };

        /**
         * Converts a single Item to a Record.
         * @param {Item} item
         * @returns {Record}
         */
        function recordFromItem(item) {
            return new Record(item.name, item.url);
        }

        /**
         *
         * @param parentid
         * @returns {Promise|*}
         */
        function getAllItems(parentid) {
            return dataService.getItems(parentid).then(function(items) {
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

        return that;
    });