'use strict';

angular.module('services')
    .factory('helper', function($q, Record, dataService) {
        return {
            /**
             * Checks whether provided file's type is supported by looking at its extension
             * @param {string} name
             * @returns {boolean}
             */
            isSupportedType: function(name) {
                return /\.mp3/.test(name);
            },

            /**
             * Returns all records found inside the item in case of directory or item itself in case of file
             * @param {TreeNode} item A item to get the records from
             * @returns {Promise<Record[]>} A promise that resolves to Record[]
             */
            getItemRecords: function(item) {
                var self = this;

                return (item.isDir ? this.getAllItems(item.id) : $q.when([item])).then(function(items) {
                    var records = [];
                    items.forEach(function(item) {
                        if (!item.isDir && self.isSupportedType(item.name)) {
                            records.push(self.recordFromItem(item));
                        }
                    });

                    return records;
                });
            },

            /**
             * Creates a Record from Item
             * @param {Item} item
             * @returns {Record}
             */
            recordFromItem: function(item) {
                return new Record(item.name, item.url);
            },

            getAllItems: function(parentid) {
                var self = this;

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
                            return self.getAllItems(item.id).then(function(items) {
                                // apply is used since then number of arguments for splice is dynamic
                                Array.prototype.splice.apply(children, [children.indexOf(item), 1].concat(items));
                                return children;
                            });
                        });
                    });

                    return result;
                });
            }
        };
    });