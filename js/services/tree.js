'use strict';

angular.module('App')
    .factory('Tree', function(TreeNode) {
        function Ctor() {
            this.root = new TreeNode({ id: 'root' });
            this.selected = undefined; // TreeNode
            this.selectedNode = undefined; // TreeNode
            this.draggedNode = undefined; // TreeNode
        }

        return Ctor;
    });
