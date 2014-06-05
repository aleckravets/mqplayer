'use strict';

angular.module('Services')
    .factory('helper', function($q, Record) {
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
             * Returns all records found inside the node
             * @param {TreeNode} node A node to get the records from
             * @returns {Promise} A promise that resolves to Record[]
             */
            getNodeRecords: function(node) {
                var self = this;

                return (node.item.isDir ? node.getChildren(true) : $q.when([node])).then(function(nodes) {
                    var records = [];
                    nodes.forEach(function(node) {
                        if (!node.item.isDir && self.isSupportedType(node.item.name))
                            records.push(self.recordFromNode(node));
                    });

                    return records;
                });
            },

            /**
             * Creates a Record from TreeNode
             * @param {TreeNode} node
             * @returns {Record}
             */
            recordFromNode: function(node) {
                return new Record(node.item.name, node.item.url);
            }
        };
    });