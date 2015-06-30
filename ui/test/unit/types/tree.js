'use strict';

describe('TreeNode', function() {
    var tree;

    beforeEach(function() {
        module('services');
        module('types');

        inject(function(Tree) {
            tree = new Tree();
        });
    });

    it("should have root defined", function() {
        expect(tree.root).toBeDefined();
    });
});