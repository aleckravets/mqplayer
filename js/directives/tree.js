'use strict';

angular.module('Tree', [])
    .directive('tree', function(tree, player, playlist) {
        return {
            restrict: 'E',
            scope: { },
            controller: function($scope, $element) {
                $scope.tree = tree;
                $scope.player = player;

                $scope.toggleDir = function(node) {
                    node.collapsed = !node.collapsed;
                    return node.getChildren().then(function(nodes) {
                        return nodes;
                    });
                };

                $scope.mousedown = function($event, node) {
                    if (tree.selectedNode)
                        tree.selectedNode.selected = false;

                    tree.selectedNode = node;

                    node.selected = !node.selected;
                };

                $scope.dblclick = function ($event, node) {
                    player.stop();
                    playlist.set(node).then(function(records) {
                        if (records.length > 0)
                            player.playRecord(records[0]);
                    });
                };

                $scope.loading = true;

                tree.root.getChildren().then(function(nodes) {
                    $scope.loading = false;
                    return nodes;
                })
                    .then(function(nodes) {
                        if (nodes[0].collapsed)
                            $scope.toggleDir(nodes[0]);
                    });
            },
            link: function(scope, element, attrs) {

            },
            templateUrl: 'tmpl/tree.html'
        };
    })
    .directive('draggable', function(tree) {
        return {
            link: function(scope, element, attrs) {
                var node = scope.node;

                element.attr('draggable', true);

                element[0].addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/html', ''); // needed for FF.
                    tree.draggedNode = node;
                });

                element[0].addEventListener('dragend', function() {
                    tree.draggedNode = undefined;
                });
            }
        };
    });