'use strict';

angular.module('App')
    .factory('TreeNode', function($q, DataService) {
        /**
         * Creates a new TreeNode
         * @param item
         * @constructor TreeNode
         */
        function Ctor(item) {
            this.item = item;

            this.collapsed = true;
            this.selected = false;
            this.loading = false;
            this.children = undefined;
        }

        Ctor.prototype = {
            /**
             * Returns a promise of child nodes
             * @param {Boolean} recursive when set to true, returns a flat array of all child nodes
             * @returns {Promise<TreeNode[]>}
             */
            getChildren: function(recursive) {
                if (!this.childrenPromise) {
                    this.childrenPromise = this.loadChildren();
                }

                if (!recursive) {
                    return this.childrenPromise;
                }

                return this.childrenPromise.then(function(nodes) {
                    var children = [];
                    var dirs = [];

                    nodes.forEach(function(node) {
                        children.push(node);
                        if (node.item.isDir) {
                            dirs.push(node);
                        }
                    });

                    var result = $q.when(children);

                    dirs.forEach(function(node) {
                        result = result.then(function() {
                            return node.getChildren(true).then(function(nodes) {
                                // apply is used since then number of arguments for splice is dynamic
                                Array.prototype.splice.apply(children, [children.indexOf(node), 1].concat(nodes));
                                return children;
                            });
                        });
                    });

                    return result;
                });
            },

            /**
             * Loads direct children of the node
             * @returns {Promise<TreeNode[]>} a promise resolved to a child nodes array
             */
            loadChildren: function() {
                var self  = this;

                this.loading = true;
                return DataService.loadItems(this.item.id).then(function(items) {
                    self.children = items.map(function(item){
                        var node = new Ctor(item);
                        return node;
                    });

                    self.loading = false;

                    return self.children;
                });
            }
        };

        return Ctor;
    });
