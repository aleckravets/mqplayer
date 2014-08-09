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
        function Ctor(client, id, name, type, url, parentid) {
            this.client = client;
            this.id = id;
            this.name = name;
            this.type = type;
//            this.expandable = type === 'dir' || type == 'root';
            this.url = url;
            this.parentid = parentid;
        }

        Ctor.prototype = {
            // todo: cache result
            getUrl: function() {
                var deferred = $q.defer();

                if (typeof this.url === 'function') {
                    this.url().then(function(url) {
                         deferred.resolve(url);
                    });
                }
                else {
                    deferred.resolve(this.url);
                }

                return deferred.promise;
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
