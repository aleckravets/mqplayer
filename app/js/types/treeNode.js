'use strict';

angular.module('types')
    .factory('TreeNode', function($q, dataService) {
        /**
         * Creates a new TreeNode
         * @param {Item} [item={}] data item, considered root if omitted
         * @constructor TreeNode
         */
        function Ctor(item) {
            this.item = item || {};

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

                    this.childrenPromise = dataService.getItems(this.item.id).then(function(items) {
                        self.children = items.map(function(item){
                            var node = new Ctor(item);
                            return node;
                        });

                        self.loading = false;

                        return self.children;
                    });
                }

                return this.childrenPromise;
            }
        };

        return Ctor;
    });
