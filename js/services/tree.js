'use strict';

angular.module('App')
    .factory('Tree', function(TreeNode) {
        function Ctor() {
        }

        Ctor.prototype = {
            root: new TreeNode({ id: 'root' }),
            selectedNode: undefined,
            draggedNode: undefined
        };

        return Ctor;
    })
