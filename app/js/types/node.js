'use strict';

angular.module('Types')
    .factory('TreeNode', function($q, DataService) {
        function Ctor(item) {
            this.item = item;

            this.collapsed = true;
            this.selected = false;
            this.loading = false;
            this.children = undefined;
        }

        Ctor.prototype = {
            getChildren: function(recursive) {
                var promise = this.getChildrenPromise();

                if (!recursive) return promise;

                return promise.then(function(nodes) {
                    var children = [];
                    var dirs = [];

                    nodes.forEach(function(node) {
                        children.push(node);
                        if (node.item.isDir) dirs.push(node);
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
            getChildrenPromise: function() {
                if (!this.childrenPromise) this.childrenPromise = this.loadChildren();

                return this.childrenPromise;
            },
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
