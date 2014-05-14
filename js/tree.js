'use strict';

angular.module('Tree', [])
    .directive('tree', ['Player', 'Item', 'DataService', function(Player, Item, DataService) {
        return {
            restrict: 'E',
            scope: { },
            controller: function($scope, $element) {
                var root = new Item();

                $scope.loading = true;

                root.getChildren().then(function(items) {
                    $scope.items = items;
                    $scope.loading = false;
                    return items;
                });

                $scope.toggleDir = function(item) {
                    item.collapsed = !item.collapsed;
                    return item.getChildren().then(function(items) {
                        return items;
                    });
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
    .directive('draggable', ['Player', function(Player) {
        return {
            link: function(scope, element, attrs) {
                var item = scope.item;

                element.attr('draggable', true);

                element[0].addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/html', ''); // needed for FF.
                    Player.dragging = item;
                });

                element[0].addEventListener('dragend', function() {
                    delete Player.dragging;
                });
            }
        };
    }])
;