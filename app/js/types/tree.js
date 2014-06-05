'use strict';

angular.module('Types')
    .factory('Tree', function($q, TreeNode, DataService) {
        function Ctor() {
            this.root = new TreeNode({ id: 'root' });
            this.selected = undefined; // TreeNode
            this.selectedNode = undefined; // TreeNode
            this.draggedNode = undefined; // TreeNode
        }

        Ctor.prototype = {

        };

        return Ctor;
    });
