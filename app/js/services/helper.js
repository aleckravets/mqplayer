'use strict';

angular.module('services')
    .factory('helper', function($q, Record, appData, Item) {
        var that = { };

        /**
         * Converts a single Item to a Record.
         * @param {Item} item
         * @returns {Record}
         */
        function recordFromItem(item) {
            return new Record(item);
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
            return (item.type == 'file' ? $q.when([item]) : item.getAllChildren()).then(function(items) {
                var records = [];
                items.forEach(function(item) {
                    if (item.type == 'file' && that.isSupportedType(item.name)) {
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
        that.getRecordsByItemIds = function(client, ids) {
            return client.getItemById(ids[0]).then(function(item) {
                if (ids.length === 1) {
                    return that.getItemRecords(item);
                }

                return client.getItemsByParent(item.parentid).then(function(siblings) {
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

        that.savePlaylist = function(name, playlist) {
            appData.playlists[name] = playlist.records.map(function(record) {
                return {
                    service: record.item.client.name,
                    id: record.item.id,
                    name: record.item.name,
                    type: record.item.type,
                    url: record.item.getUrl(true)
                };
            });

            appData.save();
        };

        that.restorePlaylist = function(name, playlist) {
            playlist.clear();

            var data = appData.playlists[name];

            playlist.records = data.map(function(_item) {
                var client;
                var item = new Item(client, _item.id, _item.name, _item.type, _item.url);
                return new Record(item);
            });
        };

        that.formatBytes = function (bytes, si) {
            var thresh = si ? 1000 : 1024;
            if(bytes < thresh) return bytes + ' B';
//            var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
            var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
            var u = -1;
            do {
                bytes /= thresh;
                ++u;
            } while(bytes >= thresh);
            return bytes.toFixed(2)+' '+units[u];
        };

        return that;
    });