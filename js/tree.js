'use strict';

angular.module('Tree', [])
    .directive('tree', ['Player', 'Item', function(Player, Item) {
        return {
            restrict: 'E',
            scope: { },
            controller: function($scope, $element) {
                var root = new Item();

                root.getChildren().then(function(items) {
                    $scope.items = items;
                });

                $scope.toggleDir = function(item) {
                    item.getChildren();
                    item.collapsed = !item.collapsed;
                };

                $scope.select = function($event, item) {
                    if ($scope.selectedItem)
                        $scope.selectedItem.selected = false;

                    $scope.selectedItem = item;

                    item.selected = !item.selected;
                };

                $scope.player = Player;
            },
            link: function(scope, element, attrs) {

            },
            templateUrl: 'tree.html'
        };
    }])
    .directive('draggable', ['TreeState', function(TreeState) {
        return {
            link: function(scope, element, attrs) {
                var item = scope.item;

                element.attr('draggable', true);

                element.on('dragstart', function(e) {
                    e.dataTransfer.setData('text/html', ''); // needed for FF.
                    TreeState.dragging = item;
                });

                element.on('dragend', function() {
                    delete TreeState.dragging;
                });
            }
        };
    }])
    .factory('TreeState', function(){
        return { };
    })
;