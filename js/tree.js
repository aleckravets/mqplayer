'use strict';

angular.module('Tree', [])
    .controller('TreeCtrl', ['$scope', 'Player', 'Item', function($scope, Player, Item) {
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
    }]);