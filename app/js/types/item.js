'use strict';

angular.module('types')
    .factory('Item', function($q) {
        /**
         * Instantiates an Item
         * @param {string} id unique identifier
         * @param {string} name
         * @param {string} type (root, dir, file)
         * @param {string} url absolute url
         * @param {integer} parentid
         * @constructor
         */
        function Ctor(client, id, name, type, url, parentid, shared) {
            this.client = client;
            this.id = id;
            this.name = name;
            this.type = type;
//            this.expandable = type === 'dir' || type == 'root';
            this.url = url;
            this.parentid = parentid;
            this.shared = shared;
        }

        Ctor.sort = function (a, b) {
            if (a.type === b.type) {
                return a.name < b.name ? -1 : 1;
            }
            else {
                return a.type === 'dir' ? -1 : 1;
            }
        };

        Ctor.prototype = {
            getUrl: function(immediate) {
                if (immediate) {
                    return typeof this.client.getFileUrl === 'function' ? this._url : this.url;
                }

                var self = this;

                if (typeof this.client.getFileUrl === 'function') {
                    if (this._url) {
                        return $q.when(this._url);
                    }
                    else {
                        return this.client.getFileUrl()
                            .then(function (url) {
                                self._url = url; // cache result on success to prevent calling it again next time
                                return url;
                            });
                    }
                }
                else {
                    return $q.when(this.url);
                }
            },

            getChildren: function() {
                return this.client.getItemsByParent(this.id);
            },

            /**
             * Recursively loads the children items and returns them as a flat array.
             * @param {string} parentid
             * @returns {Promise<Item[]>}
             */
            getAllChildren: function (parentid) {
                return this.getChildren().then(function(items) {
                    var children = [];
                    var dirs = [];

                    items.forEach(function(item) {
                        children.push(item);
                        if (item.type == 'dir') {
                            dirs.push(item);
                        }
                    });

                    var result = $q.when(children);

                    dirs.forEach(function(item) {
                        result = result.then(function() {
                            return item.getAllChildren().then(function(items) {
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

        return Ctor;
    });
