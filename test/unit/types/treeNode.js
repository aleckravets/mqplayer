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

    it("should call dataService.loadItems only once", inject(function($q, $rootScope, dataService) {
        spyOn(dataService, 'loadItems').and.callFake(function() {
            return $q.when([]);
        });

        tree.root.getChildren();
        tree.root.getChildren();

        $rootScope.$apply();

        expect(dataService.loadItems.calls.count()).toBe(1);
    }));

    it("should load data and instantiate children", inject(function($q, $rootScope, dataService, Item) {
        var items = [
            new Item('0', '0', false, '0'),
            new Item('1', '1', false, '1'),
            new Item('2', '2', false, '2'),
            new Item('3', '3', false, '3')
        ];

        spyOn(dataService, 'loadItems').and.callFake(function(parentid) {
            return $q.when(items);
        });

        tree.root.getChildren()
            .then(function(children) {
                expect(children).toBe(tree.root.children);
            });

        $rootScope.$apply();

        expect(tree.root.children.length).toBe(items.length);
        expect(tree.root.children[1].item).toBe(items[1]);
    }));

    it("should load children recursively and flatten them", inject(function($q, $rootScope, dataService, Item) {
        var filesServed = 0;

        spyOn(dataService, 'loadItems').and.callFake(function(parentid) {
            var items = [];

            for (var i = 0; i < 4; i++) {
                var id = parentid ? (parentid + '-' + i) : '' + i;

                if (i < 2) {
                    if (!parentid || parentid.replace(/\d/, '').length < 2) {
                        items.push(new Item(id, 'dir', true));
                    }
                }
                else {
                    items.push(new Item(id, 'file', false, 'url'));
                    filesServed++;
                }
            }

            return $q.when(items);
        });

        tree.root.getChildren(true)
            .then(function(allChildren) {
                expect(allChildren.length).toBe(filesServed);
            });

        $rootScope.$apply();
    }));

});