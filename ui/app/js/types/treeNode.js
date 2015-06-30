'use strict';

angular.module('types')
    .factory('TreeNode', function() {
        /**
         * Creates a new TreeNode
         * @param {Item} data item
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
             * Returns the promise of direct children of the node.
             * @returns {Promise<TreeNode[]>} a promise of child nodes.
             */
            getChildren: function() {
                if (!this.childrenPromise) {
                    var self  = this;

                    this.loading = true;

                    this.childrenPromise = this.item.getChildren()
                        .then(function(items) {
                            self.children = items.map(function(item){
                                var node = new Ctor(item);
                                return node;
                            });

                            self.empty = items.length === 0;

                            return self.children;
                        })
                        .catch(function() {

                        })
                        .finally(function() {
                            self.loading = false;
                        });
                }

                return this.childrenPromise;
            }
        };

        return Ctor;
    });
