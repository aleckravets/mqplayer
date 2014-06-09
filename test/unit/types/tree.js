'use strict';

describe('TreeNode', function() {
    var tree;

    beforeEach(function() {
        module('Services');
        module('Types');

        inject(function(Tree) {
            tree = new Tree();
        });
    });

    it("should have root defined", function() {
        expect(tree.root).toBeDefined();
    });
});