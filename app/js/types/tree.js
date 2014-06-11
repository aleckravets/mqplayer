'use strict';

angular.module('types')
    .factory('Tree', function(TreeNode) {
        function Ctor() {
            this.root = new TreeNode();
            this.selected = undefined; // TreeNode
            this.selectedNode = undefined; // TreeNode
            this.draggedNode = undefined; // TreeNode
        }

        Ctor.prototype = {

        };

        return Ctor;
    });