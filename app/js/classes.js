'use strict';

angular.module('App')
    .factory('Item', function() {
        function Ctor(data) {
            this.id = data.id;
            this.name = data.title;
            this.isDir = data.mimeType == 'application/vnd.google-apps.folder';
            this.url = data.webContentLink;
        }

        return Ctor;
    }).factory('TreeNode', function($q, DataService) {
        function Ctor(item) {
            this.item = item;

            this.collapsed = true;
            this.selected = false;
            this.loading = false;
            this.children = undefined;
        }

        Ctor.prototype = {
            getChildren: function() {
                var self = this;
                if (!this.children)
                    this.loading = true;
                return $q.when(this.children || DataService.loadItems(this.item.id).then(function(items) {
                    self.children = items.map(function(item){
                        return new Ctor(item);
                    });
                    self.loading = false;
                    return self.children;
                }));
            },
            // get directory children recursively
            getAllChildren: function() {
                var self = this;
                return this.getChildren().then(function(nodes) {
                    var children = [];
                    var dirs = [];

                    nodes.forEach(function(node, index) {
                        children.push(node);
                        if (node.item.isDir)
                            dirs.push(node);
                    });

                    var result = $q.when(children);

                    dirs.forEach(function(node) {
                        result = result.then(function() {
                            return node.getAllChildren().then(function(nodes) {
                                Array.prototype.splice.apply(children, [children.indexOf(node), 1].concat(nodes));
                                return children;
                            });
                        });
                    });

                    return result;
                });
            }
        };

        return Ctor;
    })
    .factory('Record', function() {
        function Ctor(node) {
            this.node = node;

            this.selected = false;
        }

        return Ctor;
    });
