'use strict';

angular.module('Directives')
    .directive('tree', function(session, helper) {
        return {
            restrict: 'E',
            scope: { },
            controller: function($scope, $element) {
                var tree = session.tree,
                    player = session.player,
                    playlist = session.playlist;

                $scope.tree = tree;
                $scope.player = player;

                $scope.toggleDir = function(node) {
                    node.collapsed = !node.collapsed;
                    return node.getChildren(); // load children if not loaded yet
                };

                $scope.mousedown = function($event, node) {
                    if (tree.selectedNode)
                        tree.selectedNode.selected = false;

                    tree.selectedNode = node;

                    node.selected = !node.selected;
                };

                $scope.dblclick = function ($event, node) {
                    player.stop();

                    playlist.set(helper.getNodeRecords(node)).then(function(records) {
                        if (records.length > 0) player.playRecord(records[0]);
                    });
                };

                $scope.loading = true;

                tree.root.getChildren().then(function(nodes) {
                    $scope.loading = false;

                    if (nodes.length == 0) $scope.empty = true;

                    return nodes;
                });
//                    .then(function(nodes) {
//                        if (nodes[0].collapsed)
//                            $scope.toggleDir(nodes[0]);
//                    });
            },
            link: function(scope, element, attrs) {

            },
            templateUrl: 'tmpl/tree.html'
        };
    })
    .directive('draggable', function(session) {
        return {
            link: function(scope, element, attrs) {
                var tree = session.tree,
                    player = session.player,
                    playlist = session.playlist;

                var node = scope.node;

                element.attr('draggable', true);

                element[0].addEventListener('dragstart', function(e) {
                    tree.draggedNode = node;

                    // needed for FF.
                    if (isFF) {
                        e.dataTransfer.setData('test', 'adfa');
                    }
                });

                element[0].addEventListener('dragend', function() {
                    tree.draggedNode = undefined;
                });
            }
        };
    });